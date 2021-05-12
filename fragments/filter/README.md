# STAC API - Filter Fragment

- **OpenAPI specification:** [openapi.yaml](openapi.yaml)
- **Extension [Maturity Classification](../../extensions.md#extension-maturity):** Pilot
- **Dependents:**
  - [Item Search](../../item-search)

- [STAC API - Filter Fragment](#stac-api---filter-fragment)
  - [Overview](#overview)
  - [Limitations of Item Search](#limitations-of-item-search)
  - [Filter expressiveness](#filter-expressiveness)
  - [OAFeat Part 3 Conformance Classes](#oafeat-part-3-conformance-classes)
  - [Queryables](#queryables)
  - [GET Query Parameters and POST JSON fields](#get-query-parameters-and-post-json-fields)
  - [Interaction with Endpoints](#interaction-with-endpoints)
  - [Examples](#examples)
    - [Example 1](#example-1)
      - [GET with cql-text](#get-with-cql-text)
      - [POST with cql-json](#post-with-cql-json)
    - [Example 2](#example-2)
      - [GET with cql-text](#get-with-cql-text-1)
      - [POST with cql-json](#post-with-cql-json-1)
  - [Additional Examples](#additional-examples)
      - [AND cql-text (GET)](#and-cql-text-get)
      - [AND cql-json (POST)](#and-cql-json-post)
      - [OR cql-text (GET)](#or-cql-text-get)
      - [OR cql-json (POST)](#or-cql-json-post)
    - [Temporal](#temporal)
      - [ANYINTERACTS cql-text (GET)](#anyinteracts-cql-text-get)
      - [ANYINTERACTS cql-json (POST)](#anyinteracts-cql-json-post)
    - [Spatial](#spatial)
      - [INTERSECTS cql-text (GET)](#intersects-cql-text-get)
      - [INTERSECTS cql-json (POST)](#intersects-cql-json-post)
  - [Implementation](#implementation)

## Overview

The Filter extension provides an expressive mechanism for searching based on Item attributes.

This extension uses several conformance classes defined in the 
[OGC API - Features - Part 3: Filtering and the Common Query Language (CQL)](https://portal.ogc.org/files/96288)
specification. As of May 2020, this specification is in draft status but, due to its long-standing use within 
geospatial software (e.g., GeoServer), is expected to remain largely the same in final. 

It should be noted that the "CQL" referred to here is OGC CQL. It is **not** referencing or related two other "CQL" languages, 
the [SRU (Search/Retrieve via URL) Contextual Query Language](https://www.loc.gov/standards/sru/cql/index.html) (formerly 
known as Common Query Language) or the [Cassandra Query Language](https://cassandra.apache.org/doc/latest/cql/) used by the Cassandra database.

OGC CQL has been previously described 
in [OGC Filter Encoding](https://www.ogc.org/standards/filter) and [OGC Catalogue Services 3.0 - General Model](http://docs.opengeospatial.org/is/12-168r6/12-168r6.html#62) (including a BNF grammar in Annex B). 
OAFeat Part 3 CQL formally defines syntax for both a text format (cql-text) as an ABNF grammar (largely similar to the BNF grammar in the General Model) and a JSON format (cql-json) as an OpenAPI schema, and provides a precise natural language description of the declarative semantics.

## Limitations of Item Search 

OAFeat defines a limited set of filtering capabilities. Filtering can only be done over a single collection and 
with only a bbox and datetime parameter. 

The STAC Item Search specification extends the functionality of OAFeat in a few key ways:
- It allows cross-collection filtering, whereas OAFeat only allows filtering within a single collection. (`collections` parameter, accepting 0 or more collections)
- It allows filtering by Item ID (`ids` parameter)
- It allows filtering based on a single GeoJSON Geometry, rather than only a bbox (`intersects` parameter)

However, it does not contain a formalized way to filter based on arbitrary fields in an Item. For example, there is 
no way to express the filter "item.properties.eo:cloud_cover is less than 10".

## Filter expressiveness 

This extension expands the capabilities of Item Search and the OAFeat Items resource with 
[OAFeat Part 3 CQL](https://portal.ogc.org/files/96288) 
by providing an expressive query language to construct more complex filter predicates. The operators are similar to 
those provided by SQL. The Simple CQL conformance class requires the logical operators `AND`, `OR`, and `NOT`; 
the comparison operators '=', `<`, `<=`, `>`, `>=`, `LIKE`, `IS NULL`, `BETWEEN`, `IN`; the spatial operator 
`INTERSECTS` and the temporal operator `ANYINTERACTS`. 

The ANYINTERACTS operator has effectively the same semantics as the existing `datetime` filter.

For example:
- Use of Item Property values in predicates (e.g., `item.properties.eo:cloud_cover`), using comparison operators
- Items whose `datetime` values are in the month of August of the years 2017-2021, using OR and ANYINTERACTS
- Items whose `geometry` values intersect any one of several Polygons, using OR and INTERSECTS
- Items whose `geometry` values intersect one Polygon, but do not intersect another one, using AND, NOT, and
  INTERSECTS

This extension also supports the Queryables mechanism that allows discovery of what Item fields can be used in 
predicates.

## OAFeat Part 3 Conformance Classes

OAFeat CQL defines several conformance classes that allow implementers to create arbitrary compositions of 
functionality that support whatever expressiveness they need.  Implementers many choose not to incur the cost of 
implementing functionality they do not need, or may not be able to implement functionality that is not supported by their underlying datastore.  For example, Elasticsearch does not support the spatial predicates required by the Enhanced Spatial Operators conformance class.

The Filter extension **requires** support of these three conformance classes:

- Filter (`http://www.opengis.net/spec/ogcapi-features-3/1.0/req/filter`) - defines the Queryables mechanism and 
  parameters `filter-lang`, filter-crs`, and `filter`
- Features Filter (`http://www.opengis.net/spec/ogcapi-features-3/1.0/req/features-filter`) - defines that the parameters defined in `Filter` apply to the Features endpoint (`/collections/{collectionId}/items`) defined by OAFeat Part 1. 
- Simple CQL (`http://www.opengis.net/spec/ogcapi-features-3/1.0/req/simple-cql`) - defines the query language used for the `filter` parameter defined by Filter

This STAC Filter extension extends the Filter conformance class such that these parameters also apply
to the STAC Item Search resource (/search). The OAFeat Filter conformance class already requires that these
parameters work for GET requests to the Items resource (/collections/collectionId/items). POST with a JSON body to the Items resource is not supported, as POST is used by the Transactions Extension for creating Item objects.

Additional, the implementation must support at least one of "CQL Text" (`http://www.opengis.net/spec/ogcapi-features-3/1.0/req/cql-text`) or "CQL JSON" (`http://www.opengis.net/spec/ogcapi-features-3/1.0/req/cql-json`).  It is recommended that (at least) GET requests support CQL Text and POST requests support CQL JSON.  

The Filter extension does **not** require support for the Enhanced Spatial Operators, Enhanced Temporal Operators,
Functions, Arithmetic Expressions, or Arrays conformance classes, but implementing these additional conformance 
classes and their operations is both allowed and encouraged. Implementation of these is often limited by the 
operations supported by the implementation's datastore, for example, Elasticsearch does not support the spatial 
operations required by the Enhanced Spatial Operators.

There will likely be a change to Simple CQL where this conformance class only requires support of expressions with a property name of the left hand side and a literal on the right hand side (e.g., `eo:cloud_cover <= 10`), and additional conformance classes will support arbitrary uses of properties and literals in expression. The primary motivation for this is to allow implementations that use datastores that do not easily support arbitrary expressions like these to implement Simple CQL (e.g., Elasticsearch). 

There will also likely be a change where the Simple CQL conformance class is decomposed into several other 
conformance classes to aid composition. After these changes, it is possible that this extension will not require 
the implementation of the operators IN, BETWEEN, LIKE, and IS NULL predicates.

## Queryables

The Queryables mechanism allows a client to discover what variable terms are available for use when writing filter
expressions.  These variables can be defined per-collection, and the intersection of these variables over all collections is what is available for filtering when there are no collection restrictions. These queryables are the only variables that may be used in filter expressions, and if any variable is used in expression that is not defined as a queryable, a 400 Bad Request exception should be returned.

Implementers should add queryables for all root Item fields (e.g., id, collection, geometry) with those names. Fields in Item Properties should also be exposed with their names, and not require expressions to prefix them with  `properties`. **Everything else should be fully-qualified? How to do more deeply-nested queries and those on lists is an open question. How to disambiguate names that could appear in multiple places in an Item?** 

(TBD: there is a proposal to allow finding what queryables are available for a subset of collections, e.g., `/queryables?collections=c1,c3`).  

The Landing Page endpoint (`/`) will have a Link with rel `http://www.opengis.net/def/rel/ogc/1.0/queryables` with an href to the endpoint `/queryables` (TBD: hopefully, this will have a parameter `collections` defined on it to query for the intersection of the queryables in a group of collections). Additionally, each Collection resource will have a Link to the queryables resource for that collection, e.g., `/collections/collection1/queryables`. 

The queryables endpoint returns a JSON Schema describing the names and types variables that may be used in filter expressions. This response is defined in JSON Schema because it is a well-specified typed schema, but it is not used for validating a JSON document derived from it. This schema defines the variables that may be used in a CQL filter.

These queryable variables are mapped by the service to filter Items. For example, the service may define a queryable with the name "cloud_cover" that can be used in a CQL expression like `cloud_cover <= 10`, with the semantics that only Items where the `properties.eo:cloud_cover` value was <= 10 would match the filter. The server would then translate this into an appropriate query for the data within its datastore.

Queryables can be static or dynamically derived. For example, `cloud_cover` might be specified to have a value 0 to 100 or a field may have a set of enumerated values dynamically determined by an aggreation at runtime.  This schema can be used by a UI or interactive client to dynamically expose to the user the fields that are available for filtering, and provide a precise group of options for the values of these variables.

## GET Query Parameters and POST JSON fields

This extension adds three GET query parameters or POST JSON fields to an Item Search request:

- filter-lang:`cql-text` or `cql-json`. If undefined, defaults to `cql-text` for a GET request and `cql-json` for a POST request.
- filter-crs: recommended to not be passed, but server must only accept `http://www.opengis.net/def/crs/OGC/1.3/CRS84` as a valid value, may reject any others
- filter: CQL filter expression

API implementations advertise which `filter-lang` values are supported via conformance classes in the Landing Page.
At least one must be implemented, but it is recommended to implement both. If both are advertised as conformance classes, the server should process either for a GET request, but may only process cql-json for a POST request. If POST of cql-text is not supported, the server must return a 400 error if `filter-lang=cql-text`.

## Interaction with Endpoints

Landing Page (`/`) returns:

```json
{
  "id": "example_stacapi",
  "conformsTo": [
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30",
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson",
    
    "http://www.opengis.net/spec/ogcapi_common-2/1.0/req/collections",

    "http://www.opengis.net/spec/ogcapi-features-3/1.0/req/filter",
    "http://www.opengis.net/spec/ogcapi-features-3/1.0/req/features-filter",
    "http://www.opengis.net/spec/ogcapi-features-3/1.0/req/simple-cql",
    "http://www.opengis.net/spec/ogcapi-features-3/1.0/req/cql-text",
    "http://www.opengis.net/spec/ogcapi-features-3/1.0/req/cql-json",

    "http://stacspec.org/spec/api/1.0.0-beta.1/core",
    "http://stacspec.org/spec/api/1.0.0-beta.1/req/stac-search",
    "http://stacspec.org/spec/api/1.0.0-beta.1/req/stac-response"
  ],
  "links": [
    {
      "title": "Search",
      "href": "https://example.org/search",
      "rel": "search",
      "type": "application/geo+json"
    },
    {
      "title": "Queryables",
      "href": "https://example.org/queryables",
      "rel": "http://www.opengis.net/def/rel/ogc/1.0/queryables",
      "type": "application/schema+json"
    }
  ],
  "stac_extensions": [],
  "stac_version": "1.0.0",
}
```

Client can use the link with `"rel": "http://www.opengis.net/def/rel/ogc/1.0/queryables"` to retrieve the queryables.

Queryables endpoint (`/queryables`) returns:

```json
{
  "$schema" : "https://json-schema.org/draft/2019-09/schema",
  "$id" : "https://example.org/queryables",
  "type" : "object",
  "title" : "Queryables for Example STAC API",
  "description" : "Queryable names for the example STAC API Item Search filter.",
  "properties" : {
    "id" : {
      "title" : "ID",
      "$ref": "https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/item.json#/id"
    },
    "collection" : {
      "title" : "Collection",
      "$ref": "https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/item.json#/collection"
    },
    "geometry" : {
      "title" : "Geometry",
      "$ref": "https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/item.json#/geometry"
    },
    "datetime" : {
      "title" : "Datetime",
      "$ref": "https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/datetime.json#/properties/datetime"
    },
    "eo:cloud_cover" : {
      "title" : "Cloud Cover",
      "$ref": "https://stac-extensions.github.io/eo/v1.0.0/schema.json#/properties/eo:cloud_cover"
    },
    "gsd" : {
      "title" : "Ground Sample Distance",
      "$ref": "https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/instrument.json#/properties/gsd"
    }
  }
}
```

Alternately, the client could retrieve the queryables for a single collection with 
`/collections/collections1/queryables`, which may have more queryables than available for the entire catalog, since
there may be queryables that are only relevant to that collection. 

Notice in this schema that instead of directly defining the type information about each field, we have instead used the JSON Schema `$ref` mechanism to refer to a STAC schema definition. This not only allows the reuse of these JSON Schema definitions, but also binds an arbitrarily-named Queryable to a specific STAC field. For example, in the above we know that the `eo:cloud_cover` field is referring to the field of the same name in the EO Extension not because they happen to have the same name, but rather because the `$ref` indicates it. The field could just as well be named "cloud_cover", "CloudCover", or "cc", and we would still know it filtered on the EO extension `eo:cloud_cover` field.

While these do seem quite complex to write and understand, keep in mind that query construction will likely be done with a more ergonomic SDK, and query parsing will be done with the help of a ABNF grammar and OpenAPI schema.

From the Queryables above, a client could then form the following example filter expressions. 

These parameters/fields must be supported by the Item Search endpoint and Items resource (`/collections/$collectionId/items`).

## Examples

Note: the GET examples with query parameters are unescaped to make them easier to read. 

### Example 1

#### GET with cql-text

Note that `filter-lang` defaults to `cql-text` in this case, so this is only shown for completeness. 

```
GET /search?filter-lang=cql-text&filter=id='LC08_L1TP_060247_20180905_20180912_01_T1_L1TP' AND collection='landsat8_l1tp'
```

#### POST with cql-json

Note that `filter-lang` defaults to `cql-json` and `filter-crs` defaults to `http://www.opengis.net/def/crs/OGC/1.3/CRS84` in this case.

```
POST /search
{ 
  "filter-lang"="cql-json",
  "filter-crs":"http://www.opengis.net/def/crs/OGC/1.3/CRS84",
  "filter": {
    "and": [
      "eq": [
        { "property": "id" },
        "LC08_L1TP_060247_20180905_20180912_01_T1_L1TP"
      ],
      "eq": [
        { "property": "collection" },
        "landsat8_l1tp"
      ]
    ]
  }
}
```

### Example 2

#### GET with cql-text

```
GET /search?filter=collection = 'landsat8_l1tp' 
  AND gsd <= 30
  AND eo:cloud_cover <= 10 
  AND datetime ANYINTERACTS 2021-04-08T04:39:23Z/2021-05-07T12:27:57Z 
  AND INTERSECTS(geometry, POLYGON((43.5845 -79.5442, 43.6079 -79.4893, 43.5677 -79.4632, 43.6129 -79.3925, 43.6223 -79.3238, 43.6576 -79.3163, 43.7945 -79.1178, 43.8144 -79.1542, 43.8555 -79.1714, 43.7509 -79.6390, 43.5845 -79.5442)) 
```

#### POST with cql-json

```
POST /search
{ 
  "filter-lang"="cql-json",
  "filter": {
    "and": [
      "eq": [
        { "property": "collection" },
        "landsat8_l1tp"
      ],
      "lte": [
        { "property": "eo:cloud_cover" },
        "10"
      ],
      "anyinteracts": [
        { "property": "datetime" },
        [ "2021-04-08T04:39:23Z", "2021-05-07T12:27:57Z" ]
      ],
      "intersects": [
        { "property": "geometry" },
        {
          "type": "Polygon",
          "coordinates": [
              [
                  [43.5845,-79.5442],
                  [43.6079,-79.4893],
                  [43.5677,-79.4632],
                  [43.6129,-79.3925],
                  [43.6223,-79.3238],
                  [43.6576,-79.3163],
                  [43.7945,-79.1178],
                  [43.8144,-79.1542],
                  [43.8555,-79.1714],
                  [43.7509,-79.6390],
                  [43.5845,-79.5442]
              ]
          ]
        }
      ]
    ]
  }
}
```

## Additional Examples

We'll be imagining these as queries against [EarthSearch Sentinel 2 
COG](https://stacindex.org/catalogs/earth-search#/Cnz1sryATwWudkxyZekxWx6356v9RmvvCcLLw79uHWJUDvt2?t=items)' data.
A sample STAC Item (leaving off all the asset info) is: 

```json
{
  "type": "Feature",
  "stac_version": "1.0.0-beta.2",
  "stac_extensions": [
    "eo",
    "view",
    "proj"
  ],
  "id": "S2A_60HWB_20201111_0_L2A",
  "bbox": [ 176.9997779369264, -39.83783732066656, 178.14624317719924, -38.842842449352425],
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[176.9997779369264, -39.83783732066656],[176.99978104582647,-38.84846679951431],
            [178.14624317719924, -38.842842449352425],[177.8514661209684,-39.83471270154608],
            [176.9997779369264, -39.83783732066656]]]
  },
  "properties": {
    "datetime": "2020-11-11T22:16:58Z",
    "platform": "sentinel-2a",
    "constellation": "sentinel-2",
    "instruments": ["msi"],
    "gsd": 10,
    "view:off_nadir": 0,
    "proj:epsg": 32760,
    "sentinel:utm_zone": 60,
    "sentinel:latitude_band": "H",
    "sentinel:grid_square": "WB",
    "sentinel:sequence": "0",
    "sentinel:product_id": "S2A_MSIL2A_20201111T221611_N0214_R129_T60HWB_20201111T235959",
    "sentinel:data_coverage": 78.49,
    "eo:cloud_cover": 0.85,
    "sentinel:valid_cloud_cover": true,
    "created": "2020-11-12T02:08:31.563Z",
    "updated": "2020-11-12T02:08:31.563Z"
  }
}
```

One problem in working with Sentinel-2 data is that many scenes only contain a tiny "sliver" of data, where the satellite's recording path intersection only a corner of a grid square. This examples shows 
Show me all imagery that has low cloud cover (less than 10), and high data coverage (50), as I'd like a cloud free image that is not just 
a tiny sliver of data.

#### AND cql-text (GET)

```http
/search?filter=sentinel:data_coverage > 50 AND eo:cloud_cover < 10 
```

#### AND cql-json (POST)

```json
{
    "filter": {
        "and": [
            {
                "gt": [
                    {
                        "property": "sentinel:data_coverage"
                    },
                    50
                ]
            },
            {
                "lt": [
                    {
                        "property": "eo:cloud_cover"
                    },
                    10
                ]
            }
        ]
    }
}
```

An 'or' is also supported, matching if either condition is true. Though it's not a sensible query you could get images that have full data 
coverage or low cloud cover.

#### OR cql-text (GET)

```http
/search?filter=sentinel:data_coverage > 50 OR eo:cloud_cover < 10 
```

#### OR cql-json (POST)

```json
{
  "filter": {
    "or": [
            {
               "gt": [
                  { "property": "sentinel:data_coverage" },
                  50
               ]
            },
            {
               "lt": [
                  { "property": "eo:cloud_cover" },
                  10
               }
               ]
           ]
    }
}
```

### Temporal

The only temporal operator required is `ANYINTERACTS`, which follows the same semantics as the existing 
`datetime` parameter. This is effectively that the datetime or interval operands have any overlap between them.

#### ANYINTERACTS cql-text (GET)

```http
/search?filter=datetime ANYINTERACTS 2020-11-11
```

#### ANYINTERACTS cql-json (POST)

```json
{
  "filter": {
      "anyinteracts": [
        { "property": "datetime" },
        "2020-11-11"
      ]
  }
}
```

### Spatial

The only spatial operator that must be implemented is `INTERSECTS`. This has the same semantics as the one provided
in the Item Search `intersects` parameter.  The `cql-text` format uses WKT geometries and the `cql-json` format uses 
GeoJSON geometries.

#### INTERSECTS cql-text (GET)

```http
/search?filter=INTERSECTS(geometry,POLYGON((-77.0824 38.7886,-77.0189 38.7886,-77.0189 38.8351,-77.0824 38.8351,-77.0824 38.7886)))
```

#### INTERSECTS cql-json (POST)

```json
{
    "filter": {
        "intersects": [
                { "property": "geometry" } ,
                {
                   "type": "Polygon",
                   "coordinates": [[
                        [-77.0824, 38.7886], [-77.0189, 38.7886],
                        [-77.0189, 38.8351], [-77.0824, 38.8351],
                        [-77.0824, 38.7886]
                    ]]
                }
        ]
    },        
}
```

## Implementation

* The ABNF for cql-text and OpenAPI for cql-json are in the [OAFeat (CQL) spec](https://portal.ogc.org/files/96288) 
* xtraplatform-spatial has a CQL [ANTLR 4 grammer](https://github.com/interactive-instruments/xtraplatform-spatial/tree/master/xtraplatform-cql/src/main/antlr/de/ii/xtraplatform/cql/infra)
* [GeoPython PyCQL](https://github.com/geopython/pycql/tree/master/pycql), and the [Bitner fork](https://github.com/bitner/pycql) to be used in stac-fastapi
* [https://github.com/azavea/franklin](Franklin) is working on it.

Note that the [xbib CQL library (JVM)](https://github.com/xbib/cql) is the OASIS Contextual Query Language, not 
OGC CQL, and should not be used to implement this extension, as they are significantly different query languages.
[Stacatto](https://github.com/planetlabs/staccato) uses this for their query language implementation, but it is 
not compliant with this extension.
