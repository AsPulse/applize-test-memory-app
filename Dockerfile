FROM node:17-alpine as builder
WORKDIR /usr/src/app

ARG NPM_TOKEN
COPY .npmrc .npmrc

COPY package.json ./
COPY *.lock ./
RUN yarn

COPY . .
RUN node ./build.js


FROM node:17-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
CMD node ./dist/index.js
