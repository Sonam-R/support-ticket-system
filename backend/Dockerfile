# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY backend ./backend

RUN npx prisma generate

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
COPY backend ./backend
COPY scripts/docker-backend-entrypoint.sh ./scripts/docker-backend-entrypoint.sh

RUN npx prisma generate && chmod +x ./scripts/docker-backend-entrypoint.sh

EXPOSE 5001

ENTRYPOINT ["./scripts/docker-backend-entrypoint.sh"]
CMD ["node", "backend/src/server.js"]
