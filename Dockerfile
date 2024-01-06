FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run generate
RUN npm run build
RUN npm prune --production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/prisma ./prisma
COPY initialize.sh /
COPY package.json .
COPY src/lib/server/webSocketUtils.ts ./src/lib/server/webSocketUtils.ts
COPY src/lib/roles.ts ./src/lib/roles.ts
COPY prodserver.ts .
EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT ["/initialize.sh"]
