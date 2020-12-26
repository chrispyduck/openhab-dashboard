ARG IMAGE=nodejs:15-alpine

FROM ${IMAGE} build
ARG CI=true
WORKDIR /build
ADD package.json
ADD package-lock.json
RUN npm install

ADD . .
RUN npm lint
RUN npm run build

FROM ${IMAGE} run
RUN npm install -g serve

ADD --from=build ./build .

EXPOSE 3000
ENTRYPOINT [ "serve", "-p", "3000" ]