#!/bin/bash

PATH=./node_modules/.bin:$PATH

# find all OpenAPI docs that are not fragments
FNAMES=`find . -name "openapi.yaml" -not -path "./fragments/*" -not -path "./node_modules/*"`

# use speccy to resolve
for fin in $FNAMES; do
    fout=./build/$fin
    mkdir -p ${fout%/*}
    #speccy resolve $fin > $fout
    swagger-cli bundle $fin -o $fout -t yaml
    cp build/index.html ${fout%/*}/
done

cp build/core/openapi.yaml build/openapi.yaml

# use swagger-combine
#swagger-combine build/swagger-config.yaml --continueOnConflictingPaths -o build/openapi.yaml 

# use openapi-merge-cli
#openapi-merge-cli -c build/openapi-merge-config.json
#json2yaml build/openapi-merge.json > build/openapi-merge.yaml

# use yq
#yq merge -a \
#    build/core/openapi.yaml \
#    build/item-search/openapi.yaml \
#    build/ogcapi-features/openapi.yaml \
#    build/ogcapi-features/extensions/transaction/openapi.yaml \
#    build/ogcapi-features/extensions/version/openapi.yaml \
#    | tee build/openapi-yq.yaml
