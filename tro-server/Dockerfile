FROM node:20-slim

RUN apt-get update && apt-get install -y \
    libc6 \
    libgcc1 \
    libstdc++6 \
    libglib2.0-0 \
    libssl3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 8891

CMD ["node", "index.js"]
