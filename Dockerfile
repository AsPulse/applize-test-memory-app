FROM node:17-alpine
WORKDIR /usr/src/app

ARG NPM_TOKEN
COPY .npmrc .npmrc

COPY package.json ./
COPY *.lock ./
RUN yarn

COPY . .
RUN node ./build.js
CMD node ./dist/index.js
