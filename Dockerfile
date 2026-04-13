FROM node:20-alpine

WORKDIR /app

# Copy and validate package.json first
COPY backend/package.json ./package.json
COPY backend/package-lock.json ./package-lock.json

RUN node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package.json valid');"
RUN npm ci

COPY backend/prisma ./prisma
RUN npx prisma generate

COPY backend/src ./src

EXPOSE 4003

CMD ["npm", "start"]
