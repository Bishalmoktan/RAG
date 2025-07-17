FROM node:20-slim

RUN apt-get update && apt-get install -y libc6 libstdc++6

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
