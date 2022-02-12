FROM node:latest
WORKDIR /usr/src/app

ARG NPM_TOKEN
COPY .npmrc .npmrc

COPY package.json ./
COPY *.lock ./
RUN yarn

RUN node ./build.js

COPY . .
CMD node ./dist/index.js
