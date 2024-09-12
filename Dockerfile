FROM node:20-alpine as build

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build

FROM node:20-alpine as release

WORKDIR /app

COPY --from=build /app/package*.json .
COPY --from=build /app/dist .

ENV NODE_ENV production

RUN npm ci --only=production
RUN chown -R node:node /app

USER node

EXPOSE 8080

CMD ["node", "index.js"]
