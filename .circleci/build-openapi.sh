#!/bin/bash

PATH=./node_modules/.bin:$PATH

# get version argument, or default to `dev`
VERSION=${1:-dev}

# find all OpenAPI docs that are not fragments
FNAMES=`find . -name "openapi.yaml" -not -path "./fragments/*" -not -path "./node_modules/*"`

# use speccy to resolve
for fin in $FNAMES; do
    fout=./build/$VERSION/$fin
    mkdir -p ${fout%/*}
    speccy resolve $fin > $fout
done