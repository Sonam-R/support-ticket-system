# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_API_URL=http://localhost:5001/api
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY frontend ./frontend

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

RUN npm install -g serve@14

COPY --from=builder /app/frontend/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
