# STAC API - Features

*based on [**OGC API - Features - Part 1: Core**](https://www.ogc.org/standards/ogcapi-features)*

- **OpenAPI specification:** [openapi.yaml](openapi.yaml) ([rendered version](https://api.stacspec.org/v1.0.0-beta.1/ogcapi-features)) 
  uses all the OGC API - Features openapi fragments to describe returning STAC Items.
- **Conformance URIs:**
  - <https://api.stacspec.org/v1.0.0-beta.1/ogcapi-features> 
  - <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core> - [Requirements Class Core](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#rc_core))
  - <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30> - [Requirements Class OpenAPI 3.0](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#rc_oas30))
  - <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson> - [Requirements Class GeoJSON](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_requirements_class_geojson))
- **Dependencies**:
  - [STAC API - Core](../core)
  - [OGC API - Features](https://www.ogc.org/standards/ogcapi-features)

Adding OGC API - Features (OAFeat) to a STAC API means fully implementing all their requirements, and then returning STAC 
[Items](../stac-spec/item-spec/README.md) from their `/items` endpoints. In OAFeat OpenAPI 3.0 and GeoJSON are optional 
conformance classes, enabling flexibility, but for STAC they are required, since STAC uses OpenAPI 3.0 and GeoJSON at its
core.  So the full conformance class list is in the following table.

Note that implementing OGC API - Features does not actually depend on [STAC API - Core](../core), but we include it as a dependency since
this extension discusses using it in the context of STAC. One could implement an OAFeat service, returning STAC 
[Items](../stac-spec/item-spec/README.md) and [Collections](../stac-spec/collection-spec/README.md) from their endpoints, and it will work
with OAFeat clients. But specialized STAC clients will likely display results better, and depend on the STAC landing page.

## Endpoints

The core OGC API - Features endpoints are shown below, with details provided in an 
[OpenAPI specification document](openapi.yaml).

| Endpoint                                        | Returns          | Description |
| ----------------------------------------------- | ---------------- | ----------- |
| `/`                                             | JSON             | Landing page, links to API capabilities |
| `/conformance`                                  | JSON             | Info about standards to which the API conforms |
| `/collections`                                  | JSON             | Object with a list of Collections contained in the catalog and links |
| `/collections/{collectionId}`                   | Collection       | Returns single Collection JSON |
| `/collections/{collectionId}/items`             | [ItemCollection](../fragments/itemcollection/README.md) | GeoJSON FeatureCollection-conformant entity of Items in collection |
| `/collections/{collectionId}/items/{featureId}` | Item             | Returns single Item (GeoJSON Feature) |
| `/api`                                          | OpenAPI 3.0 JSON | Returns an OpenAPI description of the service from the `service-desc` link `rel` - not required to be `/api`, but the document is required |

The OGC API - Features is a standard API that represents collections of geospatial data. It defines the RESTful interface 
to query geospatial data, with GeoJSON as a main return type. With OAFeat you can return any `Feature`, which is a geometry 
plus any number of properties. The core [STAC Item spec](../stac-spec/item-spec/README.md) 
enhances the core `Feature` with additional requirements and options to enable cataloging of spatiotemporal 'assets' like 
satellite imagery. 

OAFeat also defines the concept of a Collection, which contains Features. In OAFeat Collections are the sets of data that can 
be queried ([7.11](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_collections_)), and each describes basic 
information about the geospatial dataset, like its name and description, as well as the spatial and temporal extents of all 
the data contained. [STAC collections](../stac-spec/collection-spec/README.md) contain this same 
information, along with other STAC specific fields to provide additional metadata for searching spatiotemporal assets, and 
thus are compliant with both OAFeat Collections and STAC Collections and are returned from the `/collections/{collection_id}` 
endpoint.

In OAFeat, Features are the individual records within a Collection and are usually provided in GeoJSON format. 
[STAC Items](../stac-spec/item-spec/README.md) are compliant with the OAFeat Features 
[GeoJSON requirements class](http://docs.ogc.org/is/17-069r3/17-069r3.html#_requirements_class_geojson), and are returned from the 
`/collections/{collection_id}/items/{item_id}` endpoint. The return of other encodings 
([html](http://docs.ogc.org/is/17-069r3/17-069r3.html#rc_html), [gml](http://docs.ogc.org/is/17-069r3/17-069r3.html#rc_gmlsf0))
is outside the scope of STAC API, as the [STAC Item](../stac-spec/item-spec/item-spec.md) is
specified in GeoJSON.

A typical OAFeat will have multiple collections, and each will just offer simple search for its particular collection at 
`GET /collections/{collectionId}/items`. It is recommended to have each OAFeat Collection correspond to a STAC Collection,
and the `/collections/{collectionId}/items` endpoint can be used as a single collection search. Implementations may **optionally** 
provide support for the full superset of STAC API query parameters to the `/collections/{collectionId}/items` endpoint,
where the collection ID in the path is equivalent to providing that single value in the `collections` query parameter in 
STAC API.

Implementing OAFeat enables a wider range of clients to access the API's STAC Items, as it is a more widely implemented
protocol than STAC. 

## Examples

Note that the OAFeat endpoints *only* supports HTTP GET. HTTP POST requests are not supported. If POST is required it is 
recommended to use STAC Item Search, as it can be constrained to a single collection to act the same as an OAFeat `items`
endpoint.

Request all the data in `mycollection` that is in New Zealand:

```http
GET /collections/mycollection/items?bbox=160.6,-55.95,-170,-25.89
```

Request 100 results in `mycollection` from New Zealand:

```http
GET /collections/mycollection/items?bbox=160.6,-55.95,-170,-25.89&limit=100
```

Request all the data in `mycollection` that is in New Zealand at anytime on January 1st, 2019:

```http
GET /collections/mycollection/items?bbox=160.6,-55.95,-170,-25.89&datetime=2019-01-01T00:00:00Z/2019-01-01T23:59:59Z
```

Request 10 results from the data in `mycollection` from between January 1st (inclusive) and April 1st, 2019 (exclusive):

```http
GET /collections/mycollection/items?datetime=2019-01-01T00:00:00Z/2019-03-31T23:59:59Z&limit=10
```
