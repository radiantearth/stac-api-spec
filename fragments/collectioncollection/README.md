# STAC API - CollectionCollection Fragment

This document explains the structure and content of a SpatioTemporal Asset Catalog (STAC) CollectionCollection. 
A **CollectionCollection** is a [JSON](http://json.org) document.

Collection objects are represented in JSON format and are very flexible.
Any JSON object that contains all the required fields is a valid STAC CollectionCollection.

- Examples:
  - See the [minimal example](examples/itemcollection-sample-minimal.json), as well as a
  - [more complete example](examples/itemcollection-sample-full.json).
- [OpenAPI YAML](openapi.yaml)

## CollectionCollection fields

This object describes a STAC CollectionCollection.

| Field Name     | Type                                                                 | Description                                                                     |
| -------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| collections    | \[[STAC Collection](../../stac-spec/collection-spec/collection-spec.md)]               | **REQUIRED.** A possibly-empty array of Collection objects.                           |
| links          | \[[Link Object](../../stac-spec/item-spec/item-spec.md#link-object)] | An array of Links related to this CollectionCollection.                               |
| numberMatched  | integer                                                              | The number of Collections that meet the selection parameters, possibly estimated.     |
| numberReturned | integer                                                              | The number of Collections in the `collections` array.                                    |

## Extensions

STAC API Extensions can be found [here](https://stac-api-extensions.github.io).
