ARG NODE_VERSION=15.5-alpine

FROM node:${NODE_VERSION} AS build
ARG CI=true
WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npm run build

FROM node:${NODE_VERSION} AS run

RUN npm install -g serve

WORKDIR /app

COPY --from=build /build/build /app

EXPOSE 3000
ENTRYPOINT [ "serve", "-p", "3000" ]