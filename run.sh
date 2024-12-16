#!/usr/bin/env bash

docker run -it --rm --env-file ./env -v $PWD/app:/app -p3000:3000 node:23-alpine3.20 /app/script/build_and_run.sh