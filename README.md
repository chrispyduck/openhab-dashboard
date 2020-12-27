# openhab-dashboard
![Docker Image CI](https://github.com/chrispyduck/openhab-dashboard/workflows/Docker%20Image%20CI/badge.svg)

A touch-friendly (and hopefuly less buggy) OpenHAB dashboard based on Material UI and React. 

Note: This is my first attempt at using mobx and my first serious attempt at react hooks. I'm sure there are problems. Feel free to offer suggestions. 

## Configuration
See the example configuration under `public/config/example.json` and the inline documntation for types under `src/data/configuration`.

## Running in Docker
`docker run xtrachrispyduck/openhab-dashboard -p 3000:3000 -v $(pwd)/config:/app/config`

## Deploying with Helm
1. Execute `npm run helm.prep` to copy all config files to the helm package
2. `helm install dashboard helm` to install the package

