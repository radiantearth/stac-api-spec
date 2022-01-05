# STAC API - Filter Fragment

- **OpenAPI specification:** [openapi.yaml](openapi.yaml)
- **Conformance Classes:** 
  - Filter: <http://www.opengis.net/spec/ogcapi-features-3/1.0/conf/filter>
  - Item Search Filter: <https://api.stacspec.org/v1.0.0-beta.5/item-search#filter:item-search-filter>
  - CQL2 Text: <http://www.opengis.net/spec/cql2/1.0/conf/cql2-text>
  - CQL2 JSON: <http://www.opengis.net/spec/cql2/1.0/conf/cql2-json>
  - Basic CQL2: <http://www.opengis.net/spec/cql2/1.0/conf/basic-cql2>
  - Advanced Comparison Operators: <http://www.opengis.net/spec/cql2/1.0/conf/advanced-comparison-operators>
  - Basic Spatial Operators: <http://www.opengis.net/spec/cql2/1.0/conf/basic-spatial-operators>
  - Spatial Operators: <http://www.opengis.net/spec/cql2/1.0/conf/spatial-operators>
  - Temporal Operators: <http://www.opengis.net/spec/cql2/1.0/conf/temporal-operators>
  - Custom Functions: <http://www.opengis.net/spec/cql2/1.0/conf/functions>
  - Arithmetic Expressions: <http://www.opengis.net/spec/cql2/1.0/conf/arithmetic>
  - Array Operators: <http://www.opengis.net/spec/cql2/1.0/conf/array-operators>
  - Property-Property Comparisons: <http://www.opengis.net/spec/cql2/1.0/conf/property-property>
- **Extension [Maturity Classification](../../README.md#maturity-classification):** Pilot
- **Dependents:**
  - [Item Search](../../item-search)

- [STAC API - Filter Fragment](#stac-api---filter-fragment)
  - [Overview](#overview)
  - [Limitations of Item Search](#limitations-of-item-search)
  - [Filter expressiveness](#filter-expressiveness)
  - [Conformance Classes](#conformance-classes)
  - [Getting Started with Implementation](#getting-started-with-implementation)
  - [Queryables](#queryables)
  - [GET Query Parameters and POST JSON fields](#get-query-parameters-and-post-json-fields)
  - [Interaction with Endpoints](#interaction-with-endpoints)
  - [Examples](#examples)
    - [Example 1](#example-1)
      - [Example 1: GET with cql2-text](#example-1-get-with-cql2-text)
      - [Example 1: POST with cql2-json](#example-1-post-with-cql2-json)
    - [Example 2](#example-2)
      - [Example 2: GET with cql2-text](#example-2-get-with-cql2-text)
      - [Example 2: POST with cql2-json](#example-2-post-with-cql2-json)
    - [Example 3: Conjunction with AND](#example-3-conjunction-with-and)
      - [Example 3: AND cql2-text (GET)](#example-3-and-cql2-text-get)
      - [Example 3: AND cql2-json (POST)](#example-3-and-cql2-json-post)
    - [Example 4: Disjunction with OR](#example-4-disjunction-with-or)
      - [Example 4: OR cql2-text (GET)](#example-4-or-cql2-text-get)
      - [Example 4: OR cql2-json (POST)](#example-4-or-cql2-json-post)
    - [Example 5: Property-Property Comparisons](#example-5-property-property-comparisons)
      - [Example 5: GET with cql2-text](#example-5-get-with-cql2-text)
      - [Example 5: POST with cql2-json](#example-5-post-with-cql2-json)
    - [Example 6: Temporal Intersection](#example-6-temporal-intersection)
      - [Example 6: T_INTERSECTS cql2-text (GET)](#example-6-t_intersects-cql2-text-get)
      - [Example 6: T_INTERSECTS cql2-json (POST)](#example-6-t_intersects-cql2-json-post)
    - [Example 7: Spatial Intersection](#example-7-spatial-intersection)
      - [Example 7: S_INTERSECTS cql2-text (GET)](#example-7-s_intersects-cql2-text-get)
      - [Example 7: S_INTERSECTS cql2-json (POST)](#example-7-s_intersects-cql2-json-post)
    - [Example 8: Spatial Intersection Disjunction](#example-8-spatial-intersection-disjunction)
      - [Example 8: S_INTERSECTS cql2-text (GET)](#example-8-s_intersects-cql2-text-get)
      - [Example 8: S_INTERSECTS cql2-json (POST)](#example-8-s_intersects-cql2-json-post)
    - [Example 9: Using IS NULL](#example-9-using-is-null)
      - [Example 9: cql2-text (GET)](#example-9-cql2-text-get)
      - [Example 9: cql2-json (POST)](#example-9-cql2-json-post)
    - [Example 10: Using BETWEEN](#example-10-using-between)
      - [Example 10: cql2-text (GET)](#example-10-cql2-text-get)
      - [Example 10: cql2-json (POST)](#example-10-cql2-json-post)
    - [Example 11: Using LIKE](#example-11-using-like)
      - [Example 11: cql2-text (GET)](#example-11-cql2-text-get)
      - [Example 11: cql2-json (POST)](#example-11-cql2-json-post)

## Overview

The Filter extension provides an expressive mechanism for searching based on Item attributes.

This extension references behavior defined in the 
[OGC API - Features - Part 3: Filtering and the Common Query Language (CQL2)](https://github.com/opengeospatial/ogcapi-features/tree/master/extensions/cql) and [Common Query Language (CQL2)
](https://github.com/opengeospatial/ogcapi-features/blob/master/cql2/README.md)
specifications. As of November 2021, these specifications are still in draft status, but rapidly converging on
finalized behavior. Several behaviors have changed since the 
last published [draft](https://portal.ogc.org/files/96288), so this spec references the latest revision in the 
[OAFeat Part 3 spec's GitHub repo](https://github.com/opengeospatial/ogcapi-features/tree/master/extensions/cql)
and [Common Query Language (CQL2)](https://github.com/opengeospatial/ogcapi-features/blob/master/cql2/README.md)). 
Implementers should proceed with implementation, but must be aware that minor changes may be made
before these specs are final.

OAFeat Part 3 CQL2 formally defines the syntax of "CQL2" as both a text format (cql2-text) as an ABNF grammar 
(largely similar to the BNF grammar in the General Model for CQL) and a JSON format (cql2-json) as a JSON Schema and 
OpenAPI schema. Additionally, it defines a natural 
language description of the declarative semantics, which were never well-defined for the original CQL language.
The CQL2 Text format has had long-standing use within 
geospatial software (e.g., GeoServer), is not expected to change before final. 
OGC CQL2 Text has been previously described in [OGC Filter Encoding](https://www.ogc.org/standards/filter) and 
[OGC Catalogue Services 3.0 - General Model](http://docs.opengeospatial.org/is/12-168r6/12-168r6.html#62) 
(including a BNF grammar in Annex B). The CQL2 JSON format is newly-defined and has changed significantly during
the draft process, but is believed to be stable now.

It should be noted that the "CQL" referred to here is "CQL2" defined in OGC API - Features - Part 3. This is a related, but 
different language to the "classic" OGC CQL defined in the General Model. Relatedly, CQL is **not**
referencing or related two other "CQL" languages, 
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
[OAFeat Part 3 CQL2](https://portal.ogc.org/files/96288) 
by providing an expressive query language to construct more complex filter predicates using operators that are similar to 
those provided by SQL. This extension also supports the Queryables mechanism that allows discovery of what Item fields can be used in 
predicates.

CQL2 enables more expressive queries than supported by STAC API Item Search. These include:
- Use of Item Property values in predicates (e.g., `item.properties.eo:cloud_cover`), using comparison operators
- Items whose `datetime` values are in the month of August of the years 2017-2021, using OR and datetime comparisons
- Items whose `geometry` values intersect any one of several Polygons, using `OR` and `S_INTERSECTS`
- Items whose `geometry` values intersect one Polygon, but do not intersect another one, using AND, NOT, and
  S_INTERSECTS

## Conformance Classes

OAFeat Part 3 CQL2 defines several conformance classes that allow implementers to create compositions of 
functionality that support whatever expressiveness they need. This allows implementers to incrementally support CQL
syntax, without needing to implement a huge spec all at once.  Some implementers choose not to incur the cost of 
implementing functionality they do not need or may not be able to implement functionality that is not supported by 
their underlying datastore, e.g., Elasticsearch does not support the spatial predicates required by the 
Spatial Operators conformance class, only the `S_INTERSECTS` operator in the Basic Spatial Operators class.

The precise decomposition of the OAFeat conformance classes is still a work in progress, but is being finalized
rapidly (see [ogcapi-features/issues/579](https://github.com/opengeospatial/ogcapi-features/issues/579)). 
The STAC API Filter Extension reuses the definitions and conformance classes in OAFeat CQL,
adding only the Item Search Filter conformance class
(`https://api.stacspec.org/v1.0.0-beta.5/item-search#filter:item-search-filter`) to bind 
the CQL2 Filter behavior to the Item Search resource.

The implementation **must** support these conformance classes:

- Filter (`http://www.opengis.net/spec/ogcapi-features-3/1.0/conf/filter`) defines the Queryables mechanism and 
  parameters `filter-lang`, `filter-crs`, and `filter`.
- Basic CQL2 (`http://www.opengis.net/spec/cql2/1.0/conf/basic-cql2`) defines the basic operations allowed in 
  the query language used for the `filter` parameter defined by Filter. This includes logical operators (`AND`, `OR`, `NOT`), 
  comparison operators (`=`, `<>`, `<`, `<=`, `>`, `>=`), and `IS NULL`. The comparison operators are allowed against
  string, numeric, boolean, date, and datetime types.
- Item Search Filter (`https://api.stacspec.org/v1.0.0-beta.5/item-search#filter:item-search-filter`) binds the Filter and 
  Basic CQL2 conformance classes to apply to the Item Search endpoint (`/search`).  This class is the correlate of the OAFeat CQL2 Features 
  Filter class that binds Filter and Basic CQL2 to the Features resource (`/collections/{cid}/items`).

The implementation **must** support at least one of the "CQL2 Text" or "CQL2 JSON" conformance classes that
define the CQL2 format used in the filter parameter:

- CQL2 Text (`http://www.opengis.net/spec/cql2/1.0/conf/cql2-text`) defines that the CQL2 Text format is supported by Item Search
- CQL2 JSON (`http://www.opengis.net/spec/cql2/1.0/conf/cql2-json`) defines that the CQL2 JSON format is supported by Item Search

If both are advertised as being supported, it is only required that both be supported for GET query parameters, and that 
only that CQL2 JSON be supported for POST JSON requests.  It is recommended that clients use CQL2 Text in GET requests and 
CQL2 JSON in POST requests. 

For additional capabilities, the following classes can be implemented:
- Advanced Comparison Operators 
  (`http://www.opengis.net/spec/cql2/1.0/conf/advanced-comparison-operators`) defines the `LIKE`, 
  `BETWEEN`, and `IN` operators. **Note**: this conformance class no longer requires implementing the
  `lower` and `upper` functions.
- Basic Spatial Operators (`http://www.opengis.net/spec/cql2/1.0/conf/basic-spatial-operators`) defines the intersects operator (`S_INTERSECTS`).
- Spatial Operators 
  (`http://www.opengis.net/spec/cql2/1.0/conf/spatial-operators`) defines a set of operators that
  are part of the Dimensionally Extended Nine-intersection Model (DE-9IM) relation operators
  (`S_CONTAINS`, `S_CROSSES`, `S_DISJOINT`, `S_EQUALS`, `S_INTERSECTS`, `S_OVERLAPS`, `S_TOUCHES`, and `S_WITHIN`)
- Temporal Operators 
  (`http://www.opengis.net/spec/cql2/1.0/conf/temporal-operators`) defines several temporal
  operators that provide more expressivity with datetime types than the relative comparison
  operators
  in the Basic CQL2 class.
- Custom Functions (`http://www.opengis.net/spec/cql2/1.0/conf/functions`) defines support
  for function definition and usage.
- Arithmetic Expressions: (`http://www.opengis.net/spec/cql2/1.0/conf/arithmetic`) defines 
  support for arithmetic expressions.
- Array Operators: (`http://www.opengis.net/spec/cql2/1.0/conf/array-operators`) 
  defines array operators (`A_EQUALS`, `A_CONTAINS`, `A_CONTAINED_BY`, and `A_OVERLAPS`).
- Property-Property Comparisons: (`http://www.opengis.net/spec/cql2/1.0/conf/property-property`)
  allows the use of queryables (e.g., properties) in both positions of a clause, not just in the
  first position. This allows predicates like `property1 == property2` be expressed, whereas the
  Basic CQL2 conformance class only requires comparisons against right-hand-side literals.

Additionally, if an API implements the OGC API Features endpoint, it is **recommended** that the OAFeat Part 3 Filter, 
Features Filter, and Basic CQL2 conformance classes be implemented, which allow use of CQL2 filters against the 
OAFeat Part 1 Features endpoint (`/collections/{collectionId}/items`). Note that POST with a JSON body 
to the Features resource is not supported, as POST is used by the 
[Transaction Extension](../../ogcapi-features/extensions/transaction/README.md) for creating items.

## Getting Started with Implementation

It recommended that implementers start with fully implementing only a subset of functionality. A good place to start is 
implementing only the Basic CQL2 conformance class of logical and comparison operators, defining a static Queryables 
schema with no queryables advertised and the `additionalProperties` field set to `true`, and 
only implementing CQL2 Text. Following from that can be support for 
S_INTERSECTS, defining a static Queryables schema with only the basic Item properties, and 
implementing CQL2 JSON. From there, other comparison operators can be implemented and a more 
dynamic Queryables schema.

Formal definitions and grammars for CQL2 can be found here: 

- The [OAFeat (CQL) spec](https://portal.ogc.org/files/96288) includes an ABNF for cql2-text and both JSON Schema and 
  OpenAPI specifications for cql2-json. The standalone files are:
  - [cql.bnf](https://github.com/opengeospatial/ogcapi-features/blob/master/extensions/cql/standard/schema/cql.bnf)
  - [cql.json](https://github.com/opengeospatial/ogcapi-features/blob/master/extensions/cql/standard/schema/cql.json)
  - [cql.yml](https://github.com/opengeospatial/ogcapi-features/blob/master/extensions/cql/standard/schema/cql.yml)
- A JSON Schema for only the parts of the CQL2 JSON encoding required by this extension is [here](cql.json)
- A OpenAPI specification for only the parts of the CQL2 JSON encoding required by this extension is [here](cql.yml)
- xtraplatform-spatial has a CQL2 [ANTLR 4 grammer](https://github.com/interactive-instruments/xtraplatform-spatial/tree/master/xtraplatform-cql/src/main/antlr/de/ii/xtraplatform/cql/infra)

These projects have or are developing CQL or CQL2 support:

- [pygeofilter](https://github.com/geopython/pygeofilter) has support for the older ECQL standard 
  (similar to CQL2 Text) and will soon have support for OGC API Part 3 CQL2
- [GeoPython PyCQL](https://github.com/geopython/pycql/tree/master/pycql) (discontinued), and the 
  [Bitner fork](https://github.com/bitner/pycql) to be used in stac-fastapi
- [Franklin](https://github.com/azavea/franklin) is working on it in [this PR](https://github.com/azavea/franklin/pull/750).
- [Geotools](https://github.com/geotools/geotools) has support for [CQL2 text](https://github.com/geotools/geotools/tree/main/modules/library/cql/src/main/java/org/geotools/filter/text/cql2)

Note that the [xbib CQL library (JVM)](https://github.com/xbib/cql) is the OASIS Contextual Query Language, not 
OGC CQL, and should not be used to implement this extension, as they are significantly different query languages.
[Stacatto](https://github.com/planetlabs/staccato) uses this for their query language implementation, but it is 
not compliant with this extension.

## Queryables

The Queryables mechanism allows a client to discover what terms are available for use when writing filter
expressions.  These terms can be defined per-collection, and the intersection of these terms over all collections is what 
is available for filtering when there are no collection restrictions. By default, these queryables are the only terms that may be used 
in filter expressions, and if any term is used in expression that is not defined as a queryable and error must be 
returned according to OAFeat Part 3. It is recognized that this is a severe restriction in STAC APIs that have highly variable 
and dynamic content, so this behavior may be modified by setting the `additionalProperties` attribute in the
queryables definition to `true`.  As such, any syntactically-valid term for a property will be accepted, and the
matching semantics are such that, if an Item does not have an attribute by that name, the value is assumed to be
`null`.  It is recommended to use fully-qualified property names (e.g., `properties.eo:cloud_cover`).

Queryables are advertised via a JSON Schema document retrieved from the `/queryables` endpoint. This endpoint at the root 
retrieves queryables that apply to all collections. When used as a subresource of the collection resource 
(e.g. /collections/collection1/queryables), it returns queryables pertaining only to that single collection. 

It is required to implement both of these endpoints, but for a STAC API, this may simply be a static document of the 
STAC-specific fields.  A basic Queryables
definitions for STAC Items should include at least the fields id, collection, geometry, and datetime. 

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
    }
  },
  "additionalProperties": true
}
```

Fields in Item Properties should be exposed with their un-prefixed names, and not require expressions to prefix them 
with `properties`, e.g., `eo:cloud_cover` instead of `properties.eo:cloud_cover`. 

There may also be support for finding what queryables are available for a subset of collections, e.g., 
`/queryables?collections=c1,c3`) as described in [this issue](https://github.com/opengeospatial/ogcapi-features/issues/576).  

The Landing Page endpoint (`/`) will have a Link with rel `http://www.opengis.net/def/rel/ogc/1.0/queryables` with an href to 
the endpoint `/queryables`. Additionally, each Collection resource will have a Link to the queryables resource for that 
collection, e.g., `/collections/collection1/queryables`. 

The queryables endpoint returns a JSON Schema describing the names and types of terms that may be used in filter expressions. 
This response is defined in JSON Schema because it is a well-specified typed schema, but it is not used for validating a JSON 
document derived from it. This schema defines the terms that may be used in a CQL2 filter.

These queryable terms are mapped by the service to filter Items. For example, the service may define a queryable with the 
name "eo:cloud_cover" that can be used in a CQL2 expression like `eo:cloud_cover <= 10`, with the semantics that only Items where the 
`properties.eo:cloud_cover` value was <= 10 would match the filter. The server would then translate this into an appropriate 
query for the data within its datastore.

Queryables can be static or dynamically derived. For example, `cloud_cover` might be specified to have a value 0 to 100 or a field 
may have a set of enumerated values dynamically determined by an aggregation at runtime.  This schema can be used by a UI or 
interactive client to dynamically expose to the user the fields that are available for filtering, and provide a precise group 
of options for the values of these terms.

Queryables can also be used to advertise "synthesized" property values. The only requirement in CQL2 is that the property have a type 
and evaluate to literal value of that type or NULL. For example, a filter like "Items must have an Asset with an eo:band with 
the common_name of 'nir'" can be expressed. A Queryable `assets_bands` could be defined to have a type of array of string and 
have the semantics that it contains all of `common_name` values across all assets and bands for an Item. This could then be 
filtered with the CQL2 expression `'nir' in assets_bands`. Implementations would then expand this expression into the 
appropriate query against its datastore. (TBD if this will actually work or not. This is also related to the upcoming 
restriction on property/literal comparisons)

An implementation may also choose not to advertise any queryables, and provide the user with out-of-band information or 
simply let them try querying against fields. While this is not allowed according to the OGC CQL2 Queryable spec, it is allowed
in STAC API by the Filter Extension. In this case, the queryables endpoint (`/queryables`) would return this document:

```json
{
  "$schema" : "https://json-schema.org/draft/2019-09/schema",
  "$id" : "https://example.org/queryables",
  "type" : "object",
  "title" : "Queryables for Example STAC API",
  "description" : "Queryable names for the example STAC API Item Search filter.",
  "properties" : {
  },
  "additionalProperties": true
}
```

## GET Query Parameters and POST JSON fields

This extension adds three GET query parameters or POST JSON fields to an Item Search request:

- filter-lang:`cql2-text` or `cql2-json`. If undefined, defaults to `cql2-text` for a GET request and `cql2-json` for a POST request.
- filter-crs: recommended to not be passed, but server must only accept `http://www.opengis.net/def/crs/OGC/1.3/CRS84` as 
  a valid value, may reject any others
- filter: CQL2 filter expression

API implementations advertise which `filter-lang` values are supported via conformance classes in the Landing Page.
At least one must be implemented, but it is recommended to implement both. If both are advertised as conformance classes, the 
server should process either for a GET request, but may only process cql2-json for a POST request. If POST of cql2-text is not 
supported, the server must return a 400 error if `filter-lang=cql2-text`.

## Interaction with Endpoints

In an implementation that supports several operator classes, the Landing Page (`/`) must return a document including 
at least these values:

```json
{
  "id": "example_stacapi",
  "conformsTo": [
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30",
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson",
    
    "http://www.opengis.net/spec/ogcapi_common-2/1.0/conf/collections",

    "http://api.stacspec.org/v1.0.0-beta.5/core",
    "http://api.stacspec.org/v1.0.0-beta.5/stac-search",
    "http://api.stacspec.org/v1.0.0-beta.5/stac-response",

    "http://www.opengis.net/spec/ogcapi-features-3/1.0/conf/filter",
    "http://www.opengis.net/spec/ogcapi-features-3/1.0/conf/features-filter",
    "http://www.opengis.net/spec/cql2/1.0/conf/basic-cql2",
    "http://www.opengis.net/spec/cql2/1.0/conf/cql2-text",
    "http://www.opengis.net/spec/cql2/1.0/conf/cql2-json",
    "http://www.opengis.net/spec/cql2/1.0/conf/basic-spatial-operators",
    "http://www.opengis.net/spec/cql2/1.0/conf/advanced-comparison-operators"

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
  "type": "Catalog",
}
```

A client can use the link with `"rel": "http://www.opengis.net/def/rel/ogc/1.0/queryables"` to retrieve the queryables.

The Queryables endpoint (`/queryables`) returns something like the following:

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
  },
  "additionalProperties": true
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
and we would still know it filtered on the EO extension `eo:cloud_cover` field. For example, if the queryable was named 
"CloudCover", a CQL2 expression using that queryable would look like `CloudCover <= 10`.

While these do seem quite complex to write and understand, keep in mind that query construction will likely be done with a 
more ergonomic SDK, and query parsing will be done with the help of a ABNF grammar and OpenAPI schema.

These parameters/fields must be supported by the STAC Item Search endpoint and OAFeat Features resource (`/collections/$collectionId/items`).

## Examples

Note: the GET examples with query parameters are unescaped to make them easier to read.

The GET examples are assuming a call to `GET /search` and the POST examples are assuming a 
call to `POST /search`.

The parameter `filter-crs` always defaults to `http://www.opengis.net/def/crs/OGC/1.3/CRS84` for a STAC API, so is not shown 
in any of these examples.  

### Example 1

This example uses the queryables definition in (Interaction with Endpoints)(#interaction-with-endpoints).

#### Example 1: GET with cql2-text

Note that `filter-lang` defaults to `cql2-text` in this case. The parameter `filter-crs` defaults 
to `http://www.opengis.net/def/crs/OGC/1.3/CRS84` for a STAC API.

```http
filter=id='LC08_L1TP_060247_20180905_20180912_01_T1_L1TP' AND collection='landsat8_l1tp'
```

#### Example 1: POST with cql2-json

Note that `filter-lang` defaults to `cql2-json` in this case. The parameter `filter-crs` defaults 
to `http://www.opengis.net/def/crs/OGC/1.3/CRS84` for a STAC API.

```json
{
  "filter": {
    "op" : "and",
    "args": [
      { 
        "op": "=",
        "args": [ { "property": "id" }, "LC08_L1TP_060247_20180905_20180912_01_T1_L1TP" ] 
      },
      { 
        "op": "=",
        "args" : [ { "property": "collection" }, "landsat8_l1tp" ]
      }
    ]
  }
}
```

### Example 2

This example uses the queryables definition in [Interaction with Endpoints](#interaction-with-endpoints).

Note that filtering on the `collection` field is relevant in Item Search, since the queries are cross-collection, whereas 
OGC API Features filters only operate against a single collection already.

#### Example 2: GET with cql2-text

```http
filter=collection = 'landsat8_l1tp'
  AND gsd <= 30
  AND eo:cloud_cover <= 10
  AND datetime >= TIMESTAMP('2021-04-08T04:39:23Z')
  AND datetime <= TIMESTAMP('2021-05-07T12:27:57Z')
  AND S_INTERSECTS(geometry, POLYGON((43.5845 -79.5442, 43.6079 -79.4893, 43.5677 -79.4632, 43.6129 -79.3925, 43.6223 -79.3238, 43.6576 -79.3163, 43.7945 -79.1178, 43.8144 -79.1542, 43.8555 -79.1714, 43.7509 -79.6390, 43.5845 -79.5442))
```

#### Example 2: POST with cql2-json

```json
{
  "filter-lang": "cql2-json",
  "filter": {
    "op": "and",
    "args": [
      { 
        "op": "=", 
        "args": [ { "property": "collection" }, "landsat8_l1tp" ] 
      },
      { 
        "op": "<=", 
        "args": [ { "property": "eo:cloud_cover" }, "10" ] 
      },
      { 
        "op": ">=", 
        "args": [ { "property": "datetime" }, { "timestamp": "2021-04-08T04:39:23Z" } ] 
      },
      {
        "op": "s_intersects", 
        "args": [
          {
            "property": "geometry"
          },
          {
            "type": "Polygon",
            "coordinates": [
              [
                [43.5845, -79.5442],
                [43.6079, -79.4893],
                [43.5677, -79.4632],
                [43.6129, -79.3925],
                [43.6223, -79.3238],
                [43.6576, -79.3163],
                [43.7945, -79.1178],
                [43.8144, -79.1542],
                [43.8555, -79.1714],
                [43.7509, -79.6390],
                [43.5845, -79.5442]
              ]
            ]
          }
        ]
      }
    ]
  }
}
```

### Example 3: Conjunction with AND

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
  "stac_version": "1.0.0",
  "stac_extensions": [
    "https://stac-extensions.github.io/eo/v1.0.0/schema.json",
    "https://stac-extensions.github.io/view/v1.0.0/schema.json",
    "https://stac-extensions.github.io/projection/v1.0.0/schema.json"
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

#### Example 3: AND cql2-text (GET)

```http
filter=sentinel:data_coverage > 50 AND eo:cloud_cover < 10 
```

#### Example 3: AND cql2-json (POST)

```json
{
  "filter-lang": "cql2-json",
  "filter": {
    "op": "and",
    "args": [
      { 
        "op": ">",
        "args": [ { "property": "sentinel:data_coverage" }, 50 ]
      },
      { 
        "op": "<",
        "args": [ { "property": "eo:cloud_cover" }, 10 ]
      }
    ]
  }
}
```

An 'or' is also supported, matching if either condition is true. Though it's not a sensible query you could get images that have full data 
coverage or low cloud cover.

### Example 4: Disjunction with OR

This uses the same queryables as Example 4.

#### Example 4: OR cql2-text (GET)

```http
filter=sentinel:data_coverage > 50 OR eo:cloud_cover < 10 
```

#### Example 4: OR cql2-json (POST)

```json
{
  "filter-lang": "cql2-json",
  "filter": {
    "op": "or", 
    "args": [
      { 
        "op": ">", 
        "args": [ { "property": "sentinel:data_coverage" }, 50 ]
      },
      { 
        "op": "<", 
        "args": [ { "property": "eo:cloud_cover" }, 10 ]
      }
    ]
  }
}
```

### Example 5: Property-Property Comparisons

The Property-Property Comparisons conformance class permits queryable properties to be used on either side
of an operator. This is a generic example, as there are few STAC properties
that are comparable in a meaningful way. This example uses a contrived example of two proprietary properties,
`prop1` and `prop2` that are of the same type. 

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

#### Example 5: GET with cql2-text

```http
filter=prop1 = prop2
```

#### Example 5: POST with cql2-json

```json
{ 
  "filter-lang": "cql2-json",
  "filter": {
    "op": "eq", 
    "args": [
      { "property": "prop1" },
      { "property": "prop2" }
    ]
  }
}
```

### Example 6: Temporal Intersection

This uses the same queryables as Example 4.

The only temporal operator required is `ANYINTERACTS`. This is effectively that the datetime or interval operands 
have any overlap between them.

#### Example 6: T_INTERSECTS cql2-text (GET)

```http
filter=datetime T_INTERSECTS INTERVAL('2020-11-11T00:00:00Z', '2020-11-12T00:00:00Z')
```

#### Example 6: T_INTERSECTS cql2-json (POST)

```json
{
  "filter-lang": "cql2-json",
  "filter": {
    "op": "t_intersects", 
    "args": [
      { "property": "datetime" },
      { "interval" : [ "2020-11-11T00:00:00Z", "2020-11-12T00:00:00Z"] }
    ]
  }
}
```

### Example 7: Spatial Intersection

The only spatial operator that must be implemented for Basic Spatial Operators 
is `S_INTERSECTS`. This has the same semantics as provided
by the Item Search `intersects` parameter.  The `cql2-text` format uses WKT geometries and the `cql2-json`
format uses GeoJSON geometries.

#### Example 7: S_INTERSECTS cql2-text (GET)

```http
filter=S_INTERSECTS(geometry,POLYGON((-77.0824 38.7886,-77.0189 38.7886,-77.0189 38.8351,-77.0824 38.8351,-77.0824 38.7886)))
```

#### Example 7: S_INTERSECTS cql2-json (POST)

```json
{
  "filter-lang": "cql2-json",
  "filter": {
    "op": "s_intersects", 
    "args": [
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
  }
}
```

### Example 8: Spatial Intersection Disjunction

One limitation of the `intersects` parameter is that only a single geometry may be provided. While most
GeoJSON geometries can be combined to form a composite (e.g., multiple Polygons can be combined to form a
MultiPolygon), this is much easier to do in the query by combining `S_INTERSECTS` predicates with the `OR`
logical operator.

#### Example 8: S_INTERSECTS cql2-text (GET)

```http
filter=S_INTERSECTS(geometry,POLYGON((-77.0824 38.7886,-77.0189 38.7886,-77.0189 38.8351,-77.0824 38.8351,-77.0824 38.7886))) OR S_INTERSECTS(geometry,POLYGON((-79.0935 38.7886,-79.0290 38.7886,-79.0290 38.8351,-79.0935 38.8351,-79.0935 38.7886)))
```

#### Example 8: S_INTERSECTS cql2-json (POST)

```json
{
  "filter-lang": "cql2-json",
  "filter": { 
    "op": "or" , 
    "args": [
      { 
        "op": "s_intersects", 
        "args": [
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
      {  
        "op": "s_intersects", 
        "args": [
          { "property": "geometry" } ,
          {
            "type": "Polygon",
            "coordinates": [[
              [-79.0935, 38.7886], [-79.0290, 38.7886],
              [-79.0290, 38.8351], [-79.0935, 38.8351],
              [-79.0935, 38.7886]
            ]]
          }
        ]
      }
    ]
  }        
}
```

### Example 9: Using IS NULL

One of the main use cases for STAC API is doing cross-collection query. Commonly, this means that items have
different sets of properties. For example, a collection of Sentinel 2 data may have a property
`sentinel:data_coverage` and a collection of Landsat 8 data may have a corresponding property
`landsat:coverage_percent`, both representing what percentage of a given gridded scene actually contains
data.  However, we many also want to also include in our result items that do not have a value defined for
either of those properties. 

#### Example 9: cql2-text (GET)

```http
filter=sentinel:data_coverage > 50 OR landsat:coverage_percent < 10 OR (sentinel:data_coverage IS NULL AND landsat:coverage_percent IS NULL)
```

#### Example 9: cql2-json (POST)

```json
{
  "filter-lang": "cql2-json",
  "filter": {
    "op": "or", 
    "args": [
      { 
        "op": ">=", 
        "args": [ { "property": "sentinel:data_coverage" }, 50 ]
      },
      { 
        "op": ">=", 
        "args": [ { "property": "landsat:coverage_percent" }, 50 ]
      },
      {
        "op": "and", 
        "args": [
          { 
            "op": "isNull",
            "args": { "property": "sentinel:data_coverage" }
          },
          {
            "op": "isNull", 
            "args": { "property": "landsat:coverage_percent" }
          }
        ]
      }
    ]
  }
}
```

### Example 10: Using BETWEEN

The BETWEEN operator allows for checking if a numeric value is within a specified inclusive range.

#### Example 10: cql2-text (GET)

```http
filter=eo:cloud_cover BETWEEN 0 AND 50
```

#### Example 10: cql2-json (POST)

```json
{
  "filter-lang": "cql2-json",
  "filter": {
    "op": "between", 
    "args": [ 
      { "property": "eo:cloud_cover" }, 
      [ 0, 50 ] 
    ]
  }
}
```

### Example 11: Using LIKE 

The LIKE operator allows for pattern-based string matching.

#### Example 11: cql2-text (GET)

```http
filter=mission LIKE 'sentinel%'
```

#### Example 11: cql2-json (POST)

```json
{
  "filter-lang": "cql2-json",
  "filter": {
    "op": "like", 
    "args": [ 
      { "property": "mission" }, 
      "sentinel%"
    ]
  }
}
```

<!-- ### Example 12: Using Case-insensitive Comparison Functions

The predefined function `CASEI` allows for case-insensitive comparisons.

#### Example 12: cql2-text (GET)

```http
filter=CASEI(provider) == 'coolsat'
```

```http
filter=CASEI(provider) == 'NASA'
```

#### Example 12: cql2-json (POST)

```json
{
  "filter-lang": "cql2-json",
  "filter": {
    "op": "eq", 
    "args": [
      { 
        "lower" : { "property": "provider" }
      },
      "coolsat"
    ]
  }
}
```

```json
{
  "filter-lang": "cql2-json",
  "filter": {
    "op": "eq", 
    "args": [
      { 
        "upper": { "property": "provider" }
      },
      "NASA"
    ]
  }
}
``` -->
