ARG IMAGE=nodejs:15-alpine

FROM ${IMAGE} AS build
ARG CI=true
WORKDIR /build
ADD package.json
ADD package-lock.json
RUN npm install

ADD . .
RUN npm run build

FROM ${IMAGE} AS run
RUN npm install -g serve

ADD --from=build ./build .

EXPOSE 3000
ENTRYPOINT [ "serve", "-p", "3000" ]