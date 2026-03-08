# -------- Base --------
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# -------- Dependencies --------
FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# -------- Build --------
FROM base AS build

# 👇 Копируем .env ДО сборки
COPY .env .env
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# -------- Runtime --------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

# 👇 Кладём .env рядом с сервером
COPY --from=build /app/.env ./.env
COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
