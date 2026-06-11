# Deployment Guide - Vibe Coding Community

این راهنما نحوه دیپلوی پروژه روی سرور با Docker و Caddy را توضیح می‌دهد.

---

## پیش‌نیازها

- سرور Linux با Docker و Docker Compose
- Domain که به سرور pointing شده (vibecodingcommunity.ir)
- دسترسی SSH به سرور

---

## ۱. تنظیمات اولیه سرور

```bash
# اتصال به سرور
ssh user@your-server-ip

# آپدیت سیستم
sudo apt update && sudo apt upgrade -y

# نصب Docker (اگر نصب نیست)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# نصب Docker Compose
sudo apt install docker-compose-plugin -y

# ایجاد پوشه پروژه
mkdir -p ~/vibe-community
cd ~/vibe-community
```

---

## ۲. آپلود کد روی سرور

```bash
# از لوکال به سرور
rsync -avz /project/ user@server:~/vibe-community/

# یا با git
git clone your-repo-url ~/vibe-community
cd ~/vibe-community
```

---

## ۳. تنظیم متغیرهای محیطی

```bash
# کپی کردن env example
cp .env.example .env

# ویرایش مقادیر
nano .env
```

مقادیر مهمی که باید تنظیم کنید:
- `POSTGRES_PASSWORD`: یک پسورد قوی برای دیتابیس
- `NEXTAUTH_SECRET`: تولید با `openssl rand -base64 32`
- `SMSIR_API_KEY`: کلید API از sms.ir

---

## ۴. دیپلوی با Docker Compose

```bash
# بیلد و اجرا
docker compose -f docker-compose.prod.yml up -d --build

# مشاهده لاگ‌ها
docker compose -f docker-compose.prod.yml logs -f

# چک کردن وضعیت کانتینرها
docker compose -f docker-compose.prod.yml ps
```

---

## ۵. SSL خودکار با Caddy

Caddy به صورت خودکار SSL Certificate از Let's Encrypt دریافت می‌کند. فقط مطمئن شوید:

1. Domain correctly pointing to server IP
2. پورت 80 و 443 باز باشند روی سرور firewall

```bash
# اگر از ufw استفاده می‌کنید
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

---

## ۶. مدیریت و دیباگ

```bash
# مشاهده لاگ‌های هر سرویس
docker compose -f docker-compose.prod.yml logs app
docker compose -f docker-compose.prod.yml logs db
docker compose -f docker-compose.prod.yml logs caddy

# ری‌استارت سرویس خاص
docker compose -f docker-compose.prod.yml restart app

# ورود به داخل کانتینر برای دیباگ
docker compose -f docker-compose.prod.yml exec app sh
```

---

## ۷. آپدیت پروژه

```bash
#.pull کردن تغییرات جدید
git pull

# بیلد و اجرای مجدد
docker compose -f docker-compose.prod.yml up -d --build
```

---

## ۸. بکاپ دیتابیس

```bash
# بکاپ از دیتابیس
docker compose -f docker-compose.prod.yml exec db pg_dump -U vibeuser vibecommunity > backup.sql

# ریستور دیتابیس
docker compose -f docker-compose.prod.yml exec -T db psql -U vibeuser vibecommunity < backup.sql
```

---

## Multi-Domain Support

برای اضافه کردن پروژه جدید روی domain یا subdomain دیگر:

1. سرویس جدید به `docker-compose.prod.yml` اضافه کنید
2. domain config جدید در `Caddyfile` اضافه کنید
3. پروژه را rebuild کنید

```bash
# Caddyfile - افزودن domain جدید
newdomain.ir {
    reverse_proxy newapp:3001
}
```

---

## troubeshooting

### SSL دریافت نمی‌شود
- چک کنید domain pointing صحیح باشد
- چک کنید پورت 80 از بیرون قابل دسترس باشد
- لاگ Caddy را چک کنید: `docker compose logs caddy`

### دیتابیس وصل نمی‌شود
- مطمئن شوید POSTGRES_PASSWORD در .env با دیتابیس match دارد
- لاگ دیتابیس را چک کنید

### App 502 می‌دهد
- مطمئن شوید کانتینر app running است
- لاگ app را چک کنید

---

## Development محلی

```bash
# اجرا روی لوکال با دیتابیس
docker compose up -d

# یا بدون Docker
npm install
npm run dev
```
