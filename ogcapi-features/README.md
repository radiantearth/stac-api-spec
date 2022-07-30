# STAC API - Features

- [STAC API - Features](#stac-api---features)
  - [Link Relations](#link-relations)
  - [Endpoints](#endpoints)
  - [Item Pagination](#item-pagination)
  - [Collection Pagination](#collection-pagination)
  - [Examples](#examples)
  - [Example Landing Page for STAC API - Features](#example-landing-page-for-stac-api---features)
  - [Example Collection for STAC API - Features](#example-collection-for-stac-api---features)
  - [Extensions](#extensions)

*based on [**OGC API - Features - Part 1: Core**](https://www.ogc.org/standards/ogcapi-features)*

- **OpenAPI specification:** [openapi.yaml](openapi.yaml) ([rendered version](https://api.stacspec.org/v1.0.0-rc.1/ogcapi-features)) 
- **Conformance URIs:**
  - <https://api.stacspec.org/v1.0.0-rc.1/ogcapi-features> 
  - <https://api.stacspec.org/v1.0.0-rc.1/core> 
  - <https://api.stacspec.org/v1.0.0-rc.1/collections> 
  - <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core> - [Requirements Class Core](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#rc_core)
  - <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson> - [Requirements Class GeoJSON](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_requirements_class_geojson)
  - <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30> - [Requirements Class OpenAPI 3.0](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#rc_oas30)
    (if used for `service-desc` endpoint)
- **[Maturity Classification](../README.md#maturity-classification):** Candidate
- **Dependencies**:
  - [STAC API - Core](../core)
  - [STAC API - Collections](../collections)
  - [OGC API - Features](https://www.ogc.org/standards/ogcapi-features)
  uses all the OGC API - Features openapi fragments to describe returning STAC Item objects.

Adding OGC API - Features (OAFeat) to a STAC API means fully implementing all its requirements, and then returning STAC 
[Item](../stac-spec/item-spec/README.md) objects from its `/items` endpoints. In OAFeat, GeoJSON is an optional 
conformance class, enabling flexibility. However, STAC requires the use of GeoJSON for OAFeat
endpoints.

Note that implementing OGC API - Features does not actually depend on [STAC API - Core](../core), but we include it as a dependency since
this extension discusses using it in the context of STAC. One could implement an OAFeat service, returning STAC 
[Item](../stac-spec/item-spec/README.md) and [Collection](../stac-spec/collection-spec/README.md) objects from their endpoints, and it will work
with OAFeat clients. But specialized STAC clients will likely display results better, and depend on the STAC landing page.

## Link Relations

This conformance class also requires implementation of the link relations in the [STAC API - Core](../core) conformance class.

The following Link relations must exist in the Landing Page (root).

| **rel**       | **href**       | **From** | **Description**     |
| ------------- | -------------- | -------- | ------------------- |
| `conformance` | `/conformance` | OAFeat   | Conformance URI     |
| `data`        | `/collections` | OAFeat   | List of Collections |

## Endpoints

This conformance class also requires for the endpoints in the [STAC API - Core](../core) conformance class to be implemented.

The OGC API - Features endpoints are shown below, with details provided in an 
[OpenAPI specification document](openapi.yaml).

| Endpoint                                        | Returns                                                 | Description                                                                         |
| ----------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `/conformance`                                  | JSON                                                    | Info about standards to which the API conforms                                      |
| `/collections`                                  | JSON                                                    | Object containing an array of Collection objects in the Catalog, and Link relations |
| `/collections/{collectionId}`                   | [Collection](../stac-spec/collection-spec/README.md)    | Returns single Collection JSON                                                      |
| `/collections/{collectionId}/items`             | [ItemCollection](../fragments/itemcollection/README.md) | GeoJSON FeatureCollection-conformant entity of Item objects in collection           |
| `/collections/{collectionId}/items/{featureId}` | [Item](../stac-spec/item-spec/README.md)                | Returns single Item (GeoJSON Feature)                                               |

The OGC API - Features is a standard API that represents collections of geospatial data. It defines a RESTful interface 
to query geospatial data, with GeoJSON as a main return type. With OAFeat you can return any `Feature`, which is a geometry 
plus any number of properties. The core [STAC Item spec](../stac-spec/item-spec/README.md) 
enhances the core `Feature` with additional requirements and options to enable cataloging of spatiotemporal 'assets' like 
satellite imagery. 

OAFeat also defines the concept of a Collection, which contains Features. In OAFeat, a Collection is a set of data that can 
be queried ([7.11](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_collections_)), and each describes basic 
information about the geospatial dataset, like its name and description, as well as the spatial and temporal extents of all 
the data contained. A [STAC Collection](../stac-spec/collection-spec/README.md) contains this same 
information, along with other STAC-specific fields to provide additional metadata for searching spatiotemporal assets, and 
thus are compliant with both OAFeat Collection and STAC Collection, and are returned from the `/collections/{collectionId}` 
endpoint.

In OAFeat, Features are the individual records within a Collection and are usually provided in GeoJSON format. 
[STAC Item](../stac-spec/item-spec/README.md) objects are compliant with the OAFeat Features 
[GeoJSON requirements class](http://docs.ogc.org/is/17-069r3/17-069r3.html#_requirements_class_geojson), and are returned from the 
`/collections/{collectionId}/items/{itemId}` endpoint. The return of other encodings 
([html](http://docs.ogc.org/is/17-069r3/17-069r3.html#rc_html), [gml](http://docs.ogc.org/is/17-069r3/17-069r3.html#rc_gmlsf0))
is outside the scope of STAC API, as the [STAC Item](../stac-spec/item-spec/item-spec.md) is
specified in GeoJSON.

A typical OAFeat will have multiple collections. Simple search for items within a collection can be done
with the resource endpoint `GET /collections/{collectionId}/items`. This endpoint must be exposed via a 
link in the individual collection's endpoint with `rel=items`, as shown in the 
[Example Landing Page diagram](../overview.md#example-landing-page). Note that this relation is `items`, which is
distinct from the `item` relation defined in STAC for linking to a single Item. The part of the API implementing OAFeat will usually not use 
`item` relations directly, but instead rely on 
the collection resource linking to a paginated endpoint returning items through a link relation 
`items`, e.g., `/collections/{collectionId}` has a link with relation `items` linking 
to `/collections/{collectionId}/items`. However, static catalogs and other parts of the API may contain `item` relations.

It is recommended to have each OAFeat Collection correspond to a STAC Collection,
and the `/collections/{collectionId}/items` endpoint can be used as a single collection search. Implementations may **optionally** 
provide support for the full superset of STAC API query parameters to the `/collections/{collectionId}/items` endpoint,
where the collection ID in the path is equivalent to providing that single value in the `collections` query parameter in 
STAC API.

Implementing OAFeat enables a wider range of clients to access the API's STAC Item objects, as it is a more widely implemented
protocol than STAC. 

## Item Pagination

OAFeat supports paging through hypermedia links for the Items resource 
(`/collections/{collectionId}/items`). Since only GET requests are allowed for this endpoint, 
it is possible
to provide a Link with `rel` type `next` and the href of the full URL of the next page of results.
This link href must contain any URL parameters that are necessary 
for the implementation to understand how to provide the next page of results, e.g., the query parameters `page`, `next`,
or `token` and any additional filter parameters if given and required. For example, the links array will have an object like:

```json
    "links": [
        {
            "rel": "next",
            "href": "https://stac-api.example.com/collections/my_collection/items?page=2"
            "type": "application/geo+json"
        }
    ]
```

The href may contain any arbitrary URL parameter, which is implementation-specific:

- `https://stac-api.example.com/collections/my_collection/items?page=2`
- `https://stac-api.example.com/collections/my_collection/items?next=8a35eba9c`
- `https://stac-api.example.com/collections/my_collection/items?token=f32890a0bdb09ac3`

In addition to supporting query parameters in the URL value of the `href` field,
STAC has extended the Link object
with additional fields to support more complex HTTP requests. These include `method` to specify
an HTTP method GET or POST, `headers` to add HTTP headers in the request, and `body` with either
the entire body for the request or only the body fields that must be changed from the previous
request, as determined by the `merge` field. These fields are described in detail in the
[Item Search](../item-search/README.md#pagination) spec.

Implementations may also add link relations `prev`, `first`, and `last`. Most API implementations
should be able to support `first`, though `last` may be infeasible to implement in some data 
stores.

See the [paging examples](../item-search/examples.md#paging-examples) for additional insight.

## Collection Pagination

OAFeat does not define a specific mechanism for how clients may access all collections from servers
with many
collections. STAC - Features adds support for this with pagination (similar to the Item pagination
mechanism) through hypermedia links for the Collections resource 
(`/collections`). This mechanism aligns with pagination of collections in the 
OGC API - Common - Part 2: Geospatial Data specification. With this, a link with 
relation `next` is included in the `links` array,
and this is used to navigate to the next page of Collection objects. The specific query
parameter used for paging is implementation specific and not defined by STAC API. For example, 
an implementation may take a parameter (e.g., `page`) indicating the numeric page of results, a
base64-encoded value indicating the last result returned for the current page (e.g., `search_after` as
in Elasticsearch), or a cursor token representing backend state.  

In our simple example of numerical pages, the response for `page=3` would have a
`links` array containing these two Links indicating the URLs for the next (page=4) and 
previous (page=2) pages:

```none
"links": [
  ...
  {
    "rel": "prev",
    "href": "https://stac-api.example.com/collections?page=2"
    "type": "application/json"
  },
  {
    "rel": "next",
    "href": "https://stac-api.example.com/collections?page=4"
    "type": "application/json"
  }
]
```

In addition to supporting query parameters in the URL value of the `href` field,
STAC has extended the Link object
with additional fields to support more complex HTTP requests. These include `method` to specify
an HTTP method GET or POST, `headers` to add HTTP headers in the request, and `body` with either
the entire body for the request or only the body fields that must be changed from the previous
request, as determined by the `merge` field. These fields are described in detail in the
[Item Search](../item-search/README.md#pagination) spec.

Implementations may also add link relations `prev`, `first`, and `last`. Most API implementations
should be able to support `first`, though `last` may be infeasible to implement in some data
stores.

## Examples

Note that the OAFeat endpoints *only* allow HTTP GET. HTTP POST requests are not supported. If POST is required,
it is recommended to use STAC Item Search, as it can be constrained to a single collection to act the same as 
an OAFeat `items` endpoint.

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

## Example Landing Page for STAC API - Features

This JSON is what would be expected from an api that only implements *STAC API - Features*. In practice, 
most APIs will also implement other conformance classes, and those will be reflected in the `links` and 
`conformsTo` fields.  A more typical Landing Page example is in 
the [overview](../overview.md#example-landing-page) document.

```json
{
    "stac_version": "1.0.0",
    "id": "example-stac",
    "title": "A simple STAC API Example",
    "description": "This Catalog aims to demonstrate the a simple landing page",
    "type": "Catalog",
    "conformsTo" : [
        "https://api.stacspec.org/v1.0.0-rc.1/core",
        "https://api.stacspec.org/v1.0.0-rc.1/ogcapi-features",
        "https://api.stacspec.org/v1.0.0-rc.1/collections",
        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30",
        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson"
    ],
    "links": [
        {
            "rel": "self",
            "type": "application/json",
            "href": "https://stac-api.example.com"
        },
        {
            "rel": "root",
            "type": "application/json",
            "href": "https://stac-api.example.com"
        },
        {
            "rel": "conformance",
            "type": "application/json",
            "href": "https://stac-api.example.com/conformance"
        },
        {
            "rel": "service-desc",
            "type": "application/vnd.oai.openapi+json;version=3.0",
            "href": "https://stac-api.example.com/api"
        },
        {
            "rel": "service-doc",
            "type": "text/html",
            "href": "https://stac-api.example.com/api.html"
        },
        {
            "rel": "data",
            "type": "application/json",
            "href": "https://stac-api.example.com/collections"
        }
    ]
}
```

## Example Collection for STAC API - Features

The landing page `data` relation points to an endpoint to retrieve all collections. Each collection then has
a link relation to its `items` resource through the link with a rel value `items`.  Note here that, unlike 
as is typical with a static STAC Collection, there are no links here with rel value `item`. 

`https://stac-api.example.com/collections/aster-l1t`

```json
{
  "id": "aster-l1t",
  "type": "Collection",
  "title": "ASTER L1T",
  "links": [
    {
      "rel": "items",
      "type": "application/geo+json",
      "href": "https://stac-api.example.com/collections/aster-l1t/items"
    },
    {
      "rel": "parent",
      "type": "application/json",
      "href": "https://stac-api.example.com"
    },
    {
      "rel": "root",
      "type": "application/json",
      "href": "https://stac-api.example.com"
    },
    {
      "rel": "self",
      "type": "application/json",
      "href": "https://stac-api.example.com/collections/aster-l1t"
    }
  ]
}
```

## Extensions

These extensions provide additional functionality that enhances *STAC API - Features*. 

- [Transaction Extension](https://github.com/stac-api-extensions/transaction/blob/main/README.mda)
- [Items and Collections API Version Extension](https://github.com/stac-api-extensions/version/blob/main/README.mda)
- [Fields Extension](https://github.com/stac-api-extensions/fields/blob/main/README.mda)
- [Sort Extension](https://github.com/stac-api-extensions/sort/blob/main/README.mda)
- [Context Extension](https://github.com/stac-api-extensions/context/blob/main/README.mda)
- [Filter Extension](https://github.com/stac-api-extensions/filter/blob/main/README.mda)
- [Query Extension](https://github.com/stac-api-extensions/query/blob/main/README.mda)
