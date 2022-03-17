# STAC API - ItemCollection Fragment

This document explains the structure and content of a SpatioTemporal Asset Catalog (STAC) ItemCollection. 
An **ItemCollection** is a [GeoJSON](http://geojson.org/) [FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3) 
that is augmented with [foreign members](https://tools.ietf.org/html/rfc7946#section-6) relevant to a STAC entity.

Similarly to the relationship between a GeoJSON Feature and a STAC Item, a STAC ItemCollection must be a valid GeoJSON 
FeatureCollection to allow interoperability with existing tools that support GeoJSON. 

Item objects are represented in JSON format and are very flexible. Any JSON object that contains all the
required fields is a valid STAC ItemCollection.

- Examples:
  - See the [minimal example](examples/itemcollection-sample-minimal.json), as well as a [more complete 
    example](examples/itemcollection-sample-full.json). There are more real world inspired samples in the [examples/](examples/) folder.
- [OpenAPI YAML](openapi.yaml)

## ItemCollection fields

This object describes a STAC ItemCollection. The fields `type` and `features` are inherited from GeoJSON FeatureCollection.

| Field Name | Type                                                              | Description                                                                     |
| ---------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| type       | string                                                            | **REQUIRED.** Always "FeatureCollection" to provide compatibility with GeoJSON. |
| features   | [STAC Item](../../stac-spec/item-spec/item-spec.md)               | **REQUIRED** A possibly-empty array of Item objects.                            |
| links      | [Link Object](../../stac-spec/item-spec/item-spec.md#link-object) | An array of Links related to this ItemCollection.                               |

## Extensions

- The [Context Extension](../../item-search/README.md#context-extension) adds additional fields to STAC ItemCollection relevant 
  to their use as search results.
- The [Single File STAC Extension](https://github.com/stac-extensions/single-file-stac/blob/main/README.md) provides a set of Collection 
  and Item objects as a single file catalog.
