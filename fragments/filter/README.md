# STAC API - Filter Fragment

- **OpenAPI specification:** [openapi.yaml](openapi.yaml)
- **Extension [Maturity Classification](../../extensions.md#extension-maturity):** Pilot
- **Dependents:**
  - [Item Search](../../item-search)

## Overview

The Filter extension provides an expressive mechanism for searching based on Item attributes.

This extension uses several conformance classes defined in the 
[OGC API - Features - Part 3: Filtering and the Common Query Language (CQL)](https://portal.ogc.org/files/96288)
specification. As of May 2020, this specification is in draft status but, due to its long-standing use within 
geospatial software, is expected to remain largely the same in final. 

It should be noted that the "CQL" referred to here is OGC CQL. It is **not** referencing or related two other "CQL" languages, 
the [SRU (Search/Retrieve via URL) Contextual Query Language](https://www.loc.gov/standards/sru/cql/index.html) (formerly 
known as Common Query Language) or the [Cassandra Query Language](https://cassandra.apache.org/doc/latest/cql/) used by the Cassandra database.

OGC CQL has been previously described 
(but not formally defined) in the [https://www.ogc.org/standards/filter](OGC Filter Encoding) standard. 
OAFeat Part 3 CQL formally defines syntax for both a text format (cql-text) as an ABNF grammar and a JSON format (cql-json) as an OpenAPI schema, and provides a precise natural language description of the declarative semantics.

## Limitations of Item Search 

OAFeat defines a limited set of filtering capabilities. Filtering can only be done over a single collection and 
with only a bbox and datetime parameter. 

The STAC Item Search specification extends the functionality of OAFeat in a few key ways:
- It allows cross-collection filtering, whereas OAFeat only allows filtering within a single collection. (`collections` parameter, accepting 0 or more collections)
- It allows filtering by Item ID (`ids` parameter)
- It allows filtering based on a single GeoJSON Geometry, rather than only a bbox (`intersects` parameter)

## Filter expressiveness 

This extension expands this functionality further with [OAFeat Part 3 CQL](https://portal.ogc.org/files/96288) 
by providing an expressive query language to construct more complex predicates. The operators are similar to 
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

- Filter (`http://www.opengis.net/spec/ogcapi-features-3/1.0/req/filter`)
- Features Filter (`http://www.opengis.net/spec/ogcapi-features-3/1.0/req/features-filter`)
- Simple CQL (`http://www.opengis.net/spec/ogcapi-features-3/1.0/req/simple-cql`)

Todo: briefly describe which pieces of this are in each CC.

Additional, the implementation must support at least one of "CQL Text" (`http://www.opengis.net/spec/ogcapi-features-3/1.0/req/cql-text`) or "CQL JSON" (`http://www.opengis.net/spec/ogcapi-features-3/1.0/req/cql-json`).  It is recommended that (at least) GET requests support CQL Text and POST requests support CQL JSON.  

The Filter extension does **not** require support for the Enhanced Spatial Operators, Enhanced Temporal Operators,
Functions, Arithmetic Expressions, or Arrays conformance classes.

There will likely be a change to Simple CQL where this conformance class only requires support of expressions with a property name of the left hand side and a literal on the right hand side (e.g., `eo:cloud_cover <= 10`), and additional conformance classes will support arbitrary uses of properties and literals in expression. The primary motivation for this is to allow implementations that use datastores that do not easily support arbitrary expressions like these to implement Simple CQL (e.g., Elasticsearch). 

## Queryables

The Queryables mechanism allows a client to discover what variables are available for use when writing filter
expressions.  These variables can be defined per-collection, and the intersection of these variables over all collections is what is available for filtering when there are no collection restrictions. These queryables are the only variables that may be used in filter expressions, and if any variable is used in expression that is not defined as a queryable, a 400 Bad Request exception should be returned. 

(TBD: there is a proposal to allow finding what queryables are available for a subset of collections, e.g., `/queryables?collections=c1,c3`).  

The Landing Page endpoint (`/`) will have a Link with rel `http://www.opengis.net/def/rel/ogc/1.0/queryables` with an href to the endpoint `/queryables` (TBD: hopefully, this will have a parameter `collections` defined on it to query for the intersection of the queryables in a group of collections). Additionally, each Collection resource will have a Link to the queryables resource for that collection, e.g., `/collections/collection1/queryables`. 

The queryables endpoint returns a JSON Schema describing the names and types variables that may be used in filter expressions. This response is defined in JSON Schema because it is a well-specified typed schema, but it is not used for validating a JSON document derived from it. This schema defines the variables that may be used in a CQL filter.

These queryable variables are mapped by the service to filter Items. For example, the service may define a queryable with the name "cloud_cover" that can be used in a CQL expression like `cloud_cover <= 10`, with the semantics that only Items where the `properties.eo:cloud_cover` value was <= 10 would match the filter. The server would then translate this into an appropriate query for the data within its datastore.

Queryables can be static or dynamically derived. For example, `cloud_cover` might be specified to have a value 0 to 100 or a field may have a set of enumerated values dynamically determined by an aggreation at runtime.  This schema can be used by a UI or interactive client to dynamically expose to the user the fields that are available for filtering, and provide a precise group of options for the values of these variables.

## GET Query Parameters and POST JSON fields

This extension adds three query parameters or JSON fields to a request:

- filter-lang:`cql-text` or `cql-json`
- filter-crs: recommended to not be passed, but server must only accept `http://www.opengis.net/def/crs/OGC/1.3/CRS84` as a valid value, may reject any others
- filter: CQL filter expression

 Clients are recommended to use `cql-text` for GET and `cql-json` for POST JSON. TBD what requirements we put around supporting both for each method.

## Interaction with Endpoints

Landing Page (/) returns:

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
```json

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

### Example 1

todo: url escape this
```
GET filter-lang=cql-text&filter=id='LC08_L1TP_060247_20180905_20180912_01_T1_L1TP' AND collection='landsat8_l1tp'
```

Using `filter-lang=cql-json`:

```
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
Using `filter-lang=cql-text`:

```
GET filter-lang=cql-text&filter= <filter value>
```

where `<filter value>` is:
```
collection = 'landsat8_l1tp' 
  AND gsd <= 30
  AND eo:cloud_cover <= 10 
  AND datetime ANYINTERACTS 2021-04-08T04:39:23Z/2021-05-07T12:27:57Z 
  AND INTERSECTS(geometry, POLYGON((43.5845 -79.5442, 43.6079 -79.4893, 43.5677 -79.4632, 43.6129 -79.3925, 43.6223 -79.3238, 43.6576 -79.3163, 43.7945 -79.1178, 43.8144 -79.1542, 43.8555 -79.1714, 43.7509 -79.6390, 43.5845 -79.5442)) 
```

Using `filter-lang=cql-json`:

```
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
