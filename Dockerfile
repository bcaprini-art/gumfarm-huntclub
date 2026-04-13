FROM node:20-alpine
# cache-bust: 2
WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/prisma ./prisma
RUN npx prisma generate

COPY backend/src ./src

EXPOSE 4003

CMD ["npm", "start"]
