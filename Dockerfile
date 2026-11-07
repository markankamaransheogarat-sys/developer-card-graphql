# ============================================================================
# Multi-stage Dockerfile for Developer Digital Business Card (NestJS + Prisma)
# ============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install OpenSSL required by Prisma Engine on Alpine
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY tsconfig*.json ./
COPY src ./src/

RUN npm run build

# --- Production Stage ---
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
