#!/bin/bash

PATH=./node_modules/.bin:$PATH

# find all OpenAPI docs that are not fragments
FINS=(core/openapi.yaml item-search/openapi.yaml ogcapi-features/openapi-collections.yaml ogcapi-features/openapi-features.yaml)
FOUTS=(core item-search collections ogcapi-features)

for i in "${!FINS[@]}"; do
    fout=./build/${FOUTS[$i]}/openapi.yaml
    mkdir -p "${fout%/*}"
    openapi bundle --ext yaml --output "${fout}" "${FINS[$i]}"
    cp build/redoc_index.html "${fout%/*}"/index.html
done
