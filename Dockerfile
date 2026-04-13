FROM node:20-alpine

WORKDIR /app

COPY backend/package.json ./

RUN npm install --ignore-scripts

COPY backend/prisma ./prisma

RUN npx prisma generate

COPY backend/src ./src

EXPOSE 4003

ENV NODE_ENV=production

CMD npx prisma migrate deploy && node src/index.js
