#!/usr/bin/env bash
#
# Self-healing watchdog for vibecodingcommunity.ir
# ------------------------------------------------
# Runs cheaply (every minute via cron) and brings the site back automatically
# when it goes down, so a human/agent doesn't have to log in each time.
#
# It heals three independent failure modes:
#   1) The Next.js app container is crashed/hung   -> restart it
#   2) The host nginx (TLS + :80/:443) is stopped   -> restart it
#   3) Nothing is listening on :80 (http down)      -> reload nginx config
#
# NOTE: the app container also has `restart: unless-stopped` in
# docker-compose.prod.yml, which already auto-restarts plain crashes. This
# watchdog additionally catches *hangs* (process up but not answering) and
# nginx/port-80 problems, which a restart policy can't detect.
#
# Install once on the server (requires SSH/console access):
#   chmod +x /opt/vibe-coding-community/deploy/self-heal.sh
#   ( crontab -l 2>/dev/null | grep -v self-heal.sh ; \
#     echo '* * * * * /opt/vibe-coding-community/deploy/self-heal.sh >> /var/log/vibe-self-heal.log 2>&1' ) | crontab -
#
set -u

DIR=/opt/vibe-coding-community
COMPOSE="docker compose -f $DIR/docker-compose.prod.yml"
ts() { date '+%Y-%m-%d %H:%M:%S'; }

# 1) App: must answer on the loopback port the proxy talks to.
if ! curl -fsS --max-time 10 http://127.0.0.1:3000/api/home >/dev/null 2>&1; then
  echo "[$(ts)] app not responding on :3000 -> restarting app container"
  ( cd "$DIR" && $COMPOSE up -d app ) || docker restart vibe-app-prod
fi

# 2) Host nginx service must be active.
if command -v systemctl >/dev/null 2>&1 && ! systemctl is-active --quiet nginx; then
  echo "[$(ts)] nginx inactive -> restarting nginx"
  systemctl restart nginx
fi

# 3) Something must be listening on :80 (plain http). If not, the public site
#    "won't come up" for users who type the address without https://.
if ! ss -tlnH 'sport = :80' 2>/dev/null | grep -q .; then
  echo "[$(ts)] nothing listening on :80 -> reloading nginx"
  if nginx -t >/dev/null 2>&1; then
    systemctl reload nginx || systemctl restart nginx
  else
    echo "[$(ts)] nginx config test FAILED — manual fix needed (no :80 server block?)"
  fi
fi

# 4) HTTPS sanity check — reach the app through the real domain (works from server too).
#    Only fires if nginx is active but the full HTTPS stack isn't responding.
if command -v systemctl >/dev/null 2>&1 && systemctl is-active --quiet nginx; then
  if ! curl -fsS --max-time 12 -o /dev/null https://vibecodingcommunity.ir/api/home 2>/dev/null; then
    echo "[$(ts)] https edge unhealthy -> reloading nginx"
    systemctl reload nginx 2>/dev/null || true
  fi
fi
