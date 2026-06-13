# Production image - use pre-built Next.js
FROM node:20-slim

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install dependencies
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm install --omit=dev

# Copy pre-built Next.js files
COPY .next/standalone ./
COPY .next/static ./.next/static

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
