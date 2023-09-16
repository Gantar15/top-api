FROM node:18.17-alpine

WORKDIR /opt/app

COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production

LABEL org.opencontainers.image.source=https://github.com/Gantar15/top-api
ENTRYPOINT [ "node", "./dist/main.js" ]