#!/bin/bash

PATH=./node_modules/.bin:$PATH

# find all OpenAPI docs that are not fragments
FNAMES=`find . -name "openapi.yaml" -not -path "./fragments/*" -not -path "./node_modules/*"`

# use speccy to resolve
for fin in $FNAMES; do
    fout=./build/$fin
    mkdir -p ${fout%/*}
    speccy resolve $fin > $fout
done