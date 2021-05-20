# STAC API - Filter Fragment

- **OpenAPI specification:** [openapi.yaml](openapi.yaml)
- **Conformance Classes:** 
  - Filter (`https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:filter`) 
  - Simple CQL (`https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:simple-cql`)
  - Item Search Filter (`https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:item-search-filter`) 
  - CQL Text (`https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:cql-text`)
  - CQL JSON (`https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:cql-json`)
- **Extension [Maturity Classification](../../extensions.md#extension-maturity):** Pilot
- **Dependents:**
  - [Item Search](../../item-search)

- [STAC API - Filter Fragment](#stac-api---filter-fragment)
  - [Overview](#overview)
  - [Limitations of Item Search](#limitations-of-item-search)
  - [Filter expressiveness](#filter-expressiveness)
  - [Conformance Classes](#conformance-classes)
  - [Grammar and schemas](#grammar-and-schemas)
  - [Queryables](#queryables)
  - [GET Query Parameters and POST JSON fields](#get-query-parameters-and-post-json-fields)
  - [Interaction with Endpoints](#interaction-with-endpoints)
  - [Examples](#examples)
    - [Example 1](#example-1)
      - [Example 1: GET with cql-text](#example-1-get-with-cql-text)
      - [Example 1: POST with cql-json](#example-1-post-with-cql-json)
    - [Example 2](#example-2)
      - [Example 2: GET with cql-text](#example-2-get-with-cql-text)
      - [Example 2: POST with cql-json](#example-2-post-with-cql-json)
    - [Example 3](#example-3)
      - [Example 3: GET with cql-text](#example-3-get-with-cql-text)
      - [Example 3: POST with cql-json](#example-3-post-with-cql-json)
    - [Example 4](#example-4)
      - [Example 4: AND cql-text (GET)](#example-4-and-cql-text-get)
      - [Example 4: AND cql-json (POST)](#example-4-and-cql-json-post)
    - [Example 5](#example-5)
      - [Example 5: OR cql-text (GET)](#example-5-or-cql-text-get)
      - [Example 5: OR cql-json (POST)](#example-5-or-cql-json-post)
    - [Example 6: Temporal](#example-6-temporal)
      - [Example 6: ANYINTERACTS cql-text (GET)](#example-6-anyinteracts-cql-text-get)
      - [Example 6: ANYINTERACTS cql-json (POST)](#example-6-anyinteracts-cql-json-post)
    - [Example 6: Spatial](#example-6-spatial)
      - [Example 6: INTERSECTS cql-text (GET)](#example-6-intersects-cql-text-get)
      - [Example 6: INTERSECTS cql-json (POST)](#example-6-intersects-cql-json-post)
  - [Implementations](#implementations)

## Overview

The Filter extension provides an expressive mechanism for searching based on Item attributes.

This extension uses several conformance classes defined in the 
[OGC API - Features - Part 3: Filtering and the Common Query Language (CQL)](https://portal.ogc.org/files/96288)
specification. As of May 2020, this specification is in draft status. The only anticipated change before final is to the 
division of behavior among conformance classes, as described further 
in [OAFeat Part 3 Conformance Classes](#oafeat-part-3-conformance-classes). 

OAFeat Part 3 CQL formally defines syntax for both a text format (cql-text) as an ABNF grammar (largely similar to the BNF grammar 
in the General Model) and a JSON format (cql-json) as an OpenAPI schema, and provides a precise natural language description of 
the declarative semantics.
The CQL Text format has long-standing use within 
geospatial software (e.g., GeoServer), is expected not to change before final. 
OGC CQL Text has been previously described 
in [OGC Filter Encoding](https://www.ogc.org/standards/filter) and 
[OGC Catalogue Services 3.0 - General Model](http://docs.opengeospatial.org/is/12-168r6/12-168r6.html#62) 
(including a BNF grammar in Annex B). The CQL JSON format is newly-defined, but also not
expected to change before final.

It should be noted that the "CQL" referred to here is OGC CQL. It is **not** referencing or related two other "CQL" languages, 
the [SRU (Search/Retrieve via URL) Contextual Query Language](https://www.loc.gov/standards/sru/cql/index.html) (formerly 
known as Common Query Language) or the [Cassandra Query Language](https://cassandra.apache.org/doc/latest/cql/) used by the 
Cassandra database.

## Limitations of Item Search 

OAFeat defines a limited set of filtering capabilities. Filtering can only be done over a single collection and 
with only a single `bbox` (rectangular spatial filter) parameter and a single datetime (instant or interval) parameter. 

The STAC Item Search specification extends the functionality of OAFeat in a few key ways:
- It allows cross-collection filtering, whereas OAFeat only allows filtering within a single collection. 
  (`collections` parameter, accepting 0 or more collections)
- It allows filtering by Item ID (`ids` parameter)
- It allows filtering based on a single GeoJSON Geometry, rather than only a bbox (`intersects` parameter)

However, it does not contain a formalized way to filter based on arbitrary fields in an Item. For example, there is 
no way to express the filter "item.properties.eo:cloud_cover is less than 10". It also does not have a way to logically combine
multiple spatial or temporal filters.

## Filter expressiveness 

This extension expands the capabilities of Item Search and the OAFeat Items resource with 
[OAFeat Part 3 CQL](https://portal.ogc.org/files/96288) 
by providing an expressive query language to construct more complex filter predicates. The operators are similar to 
those provided by SQL. The Simple CQL conformance class requires the logical operators `AND`, `OR`, and `NOT`; 
the comparison operators '=', `<`, `<=`, `>`, `>=`, `LIKE`, `IS NULL`, `BETWEEN`, and `IN`; the spatial operator 
`INTERSECTS`; and the temporal operator `ANYINTERACTS`. 

The ANYINTERACTS operator has effectively the same semantics as the existing `datetime` filter.

CQL enables these types of queries:
- Use of Item Property values in predicates (e.g., `item.properties.eo:cloud_cover`), using comparison operators
- Items whose `datetime` values are in the month of August of the years 2017-2021, using OR and ANYINTERACTS
- Items whose `geometry` values intersect any one of several Polygons, using OR and INTERSECTS
- Items whose `geometry` values intersect one Polygon, but do not intersect another one, using AND, NOT, and
  INTERSECTS

This extension also supports the Queryables mechanism that allows discovery of what Item fields can be used in 
predicates.

## Conformance Classes

OAFeat CQL defines several conformance classes that allow implementers to create compositions of 
functionality that support whatever expressiveness they need.  Implementers many choose not to incur the cost of 
implementing functionality they do not need, or may not be able to implement functionality that is not supported by 
their underlying datastore, e.g., Elasticsearch does not support the spatial predicates required by the 
Enhanced Spatial Operators conformance class.

The STAC API Filter Extension reuses the definitions of several conformance classes defined in OAFeat CQL, but with a prefix of 
`https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:` instead of `http://www.opengis.net/spec/ogcapi-features-3/1.0/req/`.

The implementation must support both of these conformance classes:

- Filter (`https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:filter`) defines the Queryables mechanism and 
  parameters `filter-lang`, `filter-crs`, and `filter`.
- Simple CQL (`https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:simple-cql`) defines the query language used 
  for the `filter` parameter defined by Filter.

In place of the OAFeat CQL Features Filter class that binds Filter and Simple CQL to the Features resource 
(`/collections/{cid}/items`), the Filter Extension instead defines this conformance class:

- Item Search Filter (`https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:item-search-filter`) binds the Filter and Simple CQL
  conformance classes to apply to the Item Search endpoint (`/search`). 

The implementation must support at least one of the "CQL Text" or "CQL JSON" conformance classes that define the CQL format
used in the filter parameter:

- CQL Text (`https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:cql-text`) defines that the CQL Text format is supported by Item Search.
- CQL JSON (`https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:cql-json`) defines that the CQL JSON format is supported by Item Search

If both are advertised as being supported, it is only 
required that both be supported for GET query parameters, and that only that CQL JSON be supported for POST JSON requests. 
It is recommended that clients use CQL Text in GET requests and CQL JSON in POST requests. 

The Filter Extension does **not** require support for the Enhanced Spatial Operators, Enhanced Temporal Operators,
Functions, Arithmetic Expressions, or Arrays conformance classes, but implementing these additional conformance 
classes and their operations is both allowed and encouraged. Implementation of these is often limited by the 
operations supported by the implementation's datastore, for example, Elasticsearch does not support the spatial 
operations required by the Enhanced Spatial Operators.

Additionally, if an API implements the OGC API Features endpoint, it is **recommended** that the OAFeat Part 3 Filter, 
Features Filter, and Simple CQL conformance classes be implemented, which allow use of CQL filters against the 
OAFeat Part 1 Features endpoint (`/collections/{collectionId}/items`). Note that POST with a JSON body 
to the Features resource is not supported, as POST is used by the 
[Transaction Extension](../../ogcapi-features/extensions/transaction/README.md) for creating items.

It is likely that the OAFeat "Simple CQL" conformance class will be decomposed into several smaller conformance classes,
as described [here](https://github.com/opengeospatial/ogcapi-features/issues/579).  Until the OAFeat CQL reaches final, it is
considered compliant within a STAC API to advertise the Simple CQL conformance class but only partially-implement it, e.g., to 
only implement the logical and comparison operators. It is recommended
to provide an out-of-band way for users to discover what operators from the Simple CQL class are implemented. After OAFeat CQL is
finalized, implementations will be expected to provide correct conformance classes with respect to their implementation of CQL.

An additional change that may be made to the Simple CQL conformance class is to only require support of expressions with a property
name of the left hand side and a literal on the right hand side (e.g., `eo:cloud_cover <= 10`), and additional conformance classes to
will support arbitrary uses of properties and literals in expressions on either side. The primary motivation for this is to allow 
implementations that use datastores that do not easily support right-hand side properties to implement Simple CQL 
(e.g., Elasticsearch). Implementers should feel free to only implement `property operand literal` expressions at this time.

## Grammar and schemas

- The [OAFeat (CQL) spec](https://portal.ogc.org/files/96288) includes an ABNF for cql-text and both JSON Schema and 
  OpenAPI specifications for cql-json. The standalone files are:
  - [cql.bnf](https://github.com/opengeospatial/ogcapi-features/blob/master/extensions/cql/standard/schema/cql.bnf)
  - [cql.json](https://github.com/opengeospatial/ogcapi-features/blob/master/extensions/cql/standard/schema/cql.json)
  - [cql.yml](https://github.com/opengeospatial/ogcapi-features/blob/master/extensions/cql/standard/schema/cql.yml)
- A JSON Schema for only the parts of the CQL JSON encoding required by this extension is [here](cql.json)
- A OpenAPI specification for only the parts of the CQL JSON encoding required by this extension is [here](cql.yml)
- xtraplatform-spatial has a CQL [ANTLR 4 grammer](https://github.com/interactive-instruments/xtraplatform-spatial/tree/master/xtraplatform-cql/src/main/antlr/de/ii/xtraplatform/cql/infra)

## Queryables

The Queryables mechanism allows a client to discover what variable terms are available for use when writing filter
expressions.  These variables can be defined per-collection, and the intersection of these variables over all collections is what 
is available for filtering when there are no collection restrictions. These queryables are the only variables that may be used 
in filter expressions, and if any variable is used in expression that is not defined as a queryable and error should be 
returned according to OAFeat Part 3. It is recognized that this is a severe restriction in STAC APIs that have highly variable 
and dynamic content. It is possible that this will change in the OAFeat Part 3 spec, see 
this [issue](https://github.com/opengeospatial/ogcapi-features/issues/582). For now, implementers may choose to allow 
fully-qualified property 
names not advertised in queryables (e.g., `properties.eo:cloud_cover`, in anticipation that there be some
mechanism to explicitly allow or advertise this in the future.

Queryables are advertised via a JSON Schema document retrieved from the `/queryables` endpoint. An example that advertises 
that only the `eo:cloud_cover` property may be used in filter expressions looks like:

```json
{
  "$schema" : "https://json-schema.org/draft/2019-09/schema",
  "$id" : "https://example.org/queryables",
  "type" : "object",
  "title" : "Queryables for Example STAC API",
  "description" : "Queryable names for the example STAC API Item Search filter.",
  "properties" : {
    "eo:cloud_cover" : {
      "description" : "Cloud Cover",
      "$ref": "https://stac-extensions.github.io/eo/v1.0.0/schema.json#/properties/eo:cloud_cover"
    }
  }
}
```

Implementers should add queryables for all root Item fields (e.g., id, collection, geometry) with those names. Fields in Item 
Properties should also be exposed with their names, and not require expressions to prefix them with  `properties`. 

There may also be support for finding what queryables are available for a subset of collections, e.g., 
`/queryables?collections=c1,c3`) as described in [this issue](https://github.com/opengeospatial/ogcapi-features/issues/576).  

The Landing Page endpoint (`/`) will have a Link with rel `http://www.opengis.net/def/rel/ogc/1.0/queryables` with an href to 
the endpoint `/queryables`. Additionally, each Collection resource will have a Link to the queryables resource for that 
collection, e.g., `/collections/collection1/queryables`. 

The queryables endpoint returns a JSON Schema describing the names and types variables that may be used in filter expressions. 
This response is defined in JSON Schema because it is a well-specified typed schema, but it is not used for validating a JSON 
document derived from it. This schema defines the variables that may be used in a CQL filter.

These queryable variables are mapped by the service to filter Items. For example, the service may define a queryable with the 
name "cloud_cover" that can be used in a CQL expression like `cloud_cover <= 10`, with the semantics that only Items where the 
`properties.eo:cloud_cover` value was <= 10 would match the filter. The server would then translate this into an appropriate 
query for the data within its datastore.

Queryables can be static or dynamically derived. For example, `cloud_cover` might be specified to have a value 0 to 100 or a field 
may have a set of enumerated values dynamically determined by an aggreation at runtime.  This schema can be used by a UI or 
interactive client to dynamically expose to the user the fields that are available for filtering, and provide a precise group 
of options for the values of these variables.

Queryables can also be used to advertise synthesized property values. The only requirement in CQL is that the property have a type 
and evaluate to literal value of that type or NULL. For example, a filter like "Items must have an Asset with an eo:band with 
the common_name of 'nir'" can be expressed. A Queryable `assets_bands` could be defined to have a type of array of string and 
have the semantics that it contains all of `common_name` values across all assets and bands for an Item. This could then be 
filtered with the CQL expression `'nir' in assets_bands`. Implementations would then expand this expression into the 
appropriate query against its datastore. (TBD if this will actually work or not. This is also related to the upcoming 
restriction on property/literal comparisons)

## GET Query Parameters and POST JSON fields

This extension adds three GET query parameters or POST JSON fields to an Item Search request:

- filter-lang:`cql-text` or `cql-json`. If undefined, defaults to `cql-text` for a GET request and `cql-json` for a POST request.
- filter-crs: recommended to not be passed, but server must only accept `http://www.opengis.net/def/crs/OGC/1.3/CRS84` as 
  a valid value, may reject any others
- filter: CQL filter expression

API implementations advertise which `filter-lang` values are supported via conformance classes in the Landing Page.
At least one must be implemented, but it is recommended to implement both. If both are advertised as conformance classes, the 
server should process either for a GET request, but may only process cql-json for a POST request. If POST of cql-text is not 
supported, the server must return a 400 error if `filter-lang=cql-text`.

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

    "https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:filter",
    "https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:features-filter",
    "https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:simple-cql",
    "https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:cql-text",
    "https://api.stacspec.org/v1.0.0-beta.1/item-search#filter:cql-json",

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
      "description" : "ID",
      "$ref": "https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/item.json#/id"
    },
    "collection" : {
      "description" : "Collection",
      "$ref": "https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/item.json#/collection"
    },
    "geometry" : {
      "description" : "Geometry",
      "$ref": "https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/item.json#/geometry"
    },
    "datetime" : {
      "description" : "Datetime",
      "$ref": "https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/datetime.json#/properties/datetime"
    },
    "eo:cloud_cover" : {
      "description" : "Cloud Cover",
      "$ref": "https://stac-extensions.github.io/eo/v1.0.0/schema.json#/properties/eo:cloud_cover"
    },
    "gsd" : {
      "description" : "Ground Sample Distance",
      "$ref": "https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/instrument.json#/properties/gsd"
    },
    "assets_bands" : {
      "description" : "Asset eo:bands common names",
      "$ref": "https://stac-extensions.github.io/eo/v1.0.0/schema.json#/properties/eo:bands/common_name"    
    }
  }
}
```

Alternately, the client could retrieve the queryables for a single collection with 
`/collections/collections1/queryables`, which may have more queryables than available for the entire catalog, since
there may be queryables that are only relevant to that collection. 

Notice in this schema that instead of directly defining the type information about each field, we have instead used the JSON 
Schema `$ref` mechanism to refer to a STAC schema definition. This not only allows the reuse of these JSON Schema definitions,
but also binds an arbitrarily-named Queryable to a specific STAC field. For example, in the above we know that the 
`eo:cloud_cover` field is referring to the field of the same name in the EO Extension not because they happen to have the same 
name, but rather because the `$ref` indicates it. The field could just as well be named "cloud_cover", "CloudCover", or "cc", 
and we would still know it filtered on the EO extension `eo:cloud_cover` field.

While these do seem quite complex to write and understand, keep in mind that query construction will likely be done with a 
more ergonomic SDK, and query parsing will be done with the help of a ABNF grammar and OpenAPI schema.

From the Queryables above, a client could then form the following example filter expressions. 

These parameters/fields must be supported by the Item Search endpoint and Items resource (`/collections/$collectionId/items`).

## Examples

Note: the GET examples with query parameters are unescaped to make them easier to read. 

The parameter `filter-crs` always defaults to `http://www.opengis.net/def/crs/OGC/1.3/CRS84` for a STAC API, so is not shown 
in any of these examples.

### Example 1

This example uses the queryables definition in (Interaction with Endpoints)(#interaction-with-endpoints).

#### Example 1: GET with cql-text

Note that `filter-lang` defaults to `cql-text` in this case. The parameter `filter-crs` defaults 
to `http://www.opengis.net/def/crs/OGC/1.3/CRS84` for a STAC API.

```http
GET /search?filter=id='LC08_L1TP_060247_20180905_20180912_01_T1_L1TP' AND collection='landsat8_l1tp'
```

#### Example 1: POST with cql-json

Note that `filter-lang` defaults to `cql-json` in this case. The parameter `filter-crs` defaults 
to `http://www.opengis.net/def/crs/OGC/1.3/CRS84` for a STAC API.

```http
POST /search
{ 
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

This example uses the queryables definition in [Interaction with Endpoints](#interaction-with-endpoints).

Note that filtering on the `collection` field is relevant in Item Search, since the queries are cross-collection, whereas 
OGC API Features filters only operate against a single collection already.

#### Example 2: GET with cql-text

```http
GET /search?filter=collection = 'landsat8_l1tp' 
  AND gsd <= 30
  AND eo:cloud_cover <= 10 
  AND datetime ANYINTERACTS 2021-04-08T04:39:23Z/2021-05-07T12:27:57Z 
  AND INTERSECTS(geometry, POLYGON((43.5845 -79.5442, 43.6079 -79.4893, 43.5677 -79.4632, 43.6129 -79.3925, 43.6223 -79.3238, 43.6576 -79.3163, 43.7945 -79.1178, 43.8144 -79.1542, 43.8555 -79.1714, 43.7509 -79.6390, 43.5845 -79.5442)) 
```

#### Example 2: POST with cql-json

```http
POST /search
{ 
  "filter-lang": "cql-json",
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

### Example 3

Queryable properties can be used on either side of an operator. This is a generic example, as there are are few STAC properties
that are comparable in a meaningful way. This example uses a contrived example of two proprietary properties, `prop1` and `prop2` that are of the 
same type. 

This queryables JSON Schema is used in these examples:

```json
{
  "$schema" : "https://json-schema.org/draft/2019-09/schema",
  "$id" : "https://example.org/queryables",
  "type" : "object",
  "title" : "Queryables for Example STAC API",
  "description" : "Queryable names for the example STAC API Item Search filter.",
  "properties" : {
    "prop1" : {
      "description" : "Property 1",
      "type": "integer"
    },
    "prop2" : {
      "description" : "Property 2",
      "type": "integer"    
    }
  }
}
```

#### Example 3: GET with cql-text

```http
GET /search?filter=prop1 = prop2
```

#### Example 3: POST with cql-json

```http
POST /search
{ 
  "filter-lang": "cql-json",
  "filter": {
    "eq": [
      { "property": "prop1" },
      { "property": "prop2" }
    ]
  }
}
```

### Example 4

We'll be imagining these as queries against [EarthSearch Sentinel 2 
COG](https://stacindex.org/catalogs/earth-search#/Cnz1sryATwWudkxyZekxWx6356v9RmvvCcLLw79uHWJUDvt2?t=items) data.

The queryables defined are as follows:

```json
{
  "$schema" : "https://json-schema.org/draft/2019-09/schema",
  "$id" : "https://example.org/queryables",
  "type" : "object",
  "title" : "Queryables for Example STAC API",
  "description" : "Queryable names for the example STAC API Item Search filter.",
  "properties" : {
    "geometry" : {
      "description" : "Geometry",
      "$ref": "https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/item.json#/geometry"
    },
    "datetime" : {
      "description" : "Datetime",
      "$ref": "https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/datetime.json#/properties/datetime"
    },
    "eo:cloud_cover" : {
      "description" : "Cloud Cover",
      "$ref": "https://stac-extensions.github.io/eo/v1.0.0/schema.json#/properties/eo:cloud_cover"
    },
    "acme:data_coverage" : {
      "description" : "Acme Sat Data Coverage",
      "type": "integer",
      "minimum": 0,
      "maximum": 100
    },
    "acme:grid_id" : {
      "description" : "Acme Sat Grid ID",
      "type": "string"
    }
  }
}
```

Note that `acme:data_coverage` and `acme:grid_id` are properties that are not defined in an extension schema, and are intended to
represent vendor-specific properties. Because of this, they are fully specified directly in the JSON Schema. However, it is 
recommended that vendor-specific properties be published as part of a well-defined extension schema, so these only represent ones 
that have not followed that recommendation.

A sample STAC Item (excluding `assets`) is: 

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

One problem in working with Sentinel-2 data is that many scenes only contain a tiny "sliver" of data, where the satellite's 
recording path intersection only a corner of a grid square. This examples shows 
Show me all imagery that has low cloud cover (less than 10), and high data coverage (50), as I'd like a cloud free image that is not just 
a tiny sliver of data.

#### Example 4: AND cql-text (GET)

```http
/search?filter=sentinel:data_coverage > 50 AND eo:cloud_cover < 10 
```

#### Example 4: AND cql-json (POST)

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

### Example 5

This uses the same queryables as Example 4.

#### Example 5: OR cql-text (GET)

```http
/search?filter=sentinel:data_coverage > 50 OR eo:cloud_cover < 10 
```

#### Example 5: OR cql-json (POST)

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
               ]
            }
      ]
    }
}
```

### Example 6: Temporal

This uses the same queryables as Example 4.

The only temporal operator required is `ANYINTERACTS`, which follows the same semantics as the existing 
`datetime` parameter. This is effectively that the datetime or interval operands have any overlap between them.

#### Example 6: ANYINTERACTS cql-text (GET)

```http
/search?filter=datetime ANYINTERACTS 2020-11-11
```

#### Example 6: ANYINTERACTS cql-json (POST)

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

### Example 6: Spatial

The only spatial operator that must be implemented is `INTERSECTS`. This has the same semantics as the one provided
in the Item Search `intersects` parameter.  The `cql-text` format uses WKT geometries and the `cql-json` format uses 
GeoJSON geometries.

#### Example 6: INTERSECTS cql-text (GET)

```http
/search?filter=INTERSECTS(geometry,POLYGON((-77.0824 38.7886,-77.0189 38.7886,-77.0189 38.8351,-77.0824 38.8351,-77.0824 38.7886)))
```

#### Example 6: INTERSECTS cql-json (POST)

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

## Implementations

- [GeoPython PyCQL](https://github.com/geopython/pycql/tree/master/pycql), and the 
  [Bitner fork](https://github.com/bitner/pycql) to be used in stac-fastapi
- [Franklin](https://github.com/azavea/franklin) is working on it in [this PR](https://github.com/azavea/franklin/pull/750).
- [Geotools](https://github.com/geotools/geotools) has support for [CQL text](https://github.com/geotools/geotools/tree/main/modules/library/cql/src/main/java/org/geotools/filter/text/cql2)

Note that the [xbib CQL library (JVM)](https://github.com/xbib/cql) is the OASIS Contextual Query Language, not 
OGC CQL, and should not be used to implement this extension, as they are significantly different query languages.
[Stacatto](https://github.com/planetlabs/staccato) uses this for their query language implementation, but it is 
not compliant with this extension.
