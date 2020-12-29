ARG NODE_VERSION=15.5-alpine
ARG NGINX_VERSION=1.18-alpine

FROM node:${NODE_VERSION} AS build
ARG CI=true

WORKDIR /build

COPY package.json .
COPY package-lock.json .

RUN chown -Rv node:node /build

USER node
RUN npm install

COPY . .
RUN npm run build

FROM nginx:${NGINX_VERSION} AS run

COPY --from=build --chown=nginx:nginx /build/build /usr/share/nginx/html