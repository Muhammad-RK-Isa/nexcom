FROM node:18.8-alpine as base

FROM base as builder

WORKDIR /home/node/app
COPY package*.json ./

COPY . .
RUN bun install
RUN bun run build

FROM base as runtime

ENV NODE_ENV=production

WORKDIR /home/node/app
COPY package*.json  ./
COPY bun.lockb ./

RUN bun install --production

EXPOSE 3000

CMD ["node", "dist/server.js"]
