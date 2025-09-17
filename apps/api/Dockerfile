# --- Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY tsconfig*.json ./
COPY src ./src
COPY prisma ./prisma
RUN npm run prisma:generate
RUN npm run build

# --- Runtime stage
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json
# uploads volume
RUN mkdir -p /app/uploads
VOLUME ["/app/uploads"]
EXPOSE 4000
CMD sh -c "node dist/prisma/migrate-and-seed.js && node dist/main.js"
