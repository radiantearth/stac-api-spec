# Filter API Extension

**Extension [Maturity Classification](../README.md#extension-maturity): Pilot**

The STAC search endpoint, `/search`, by default only accepts the core filter parameters given in the *[api-spec](../../api-spec.md)*.
The Filter API extension adds additional filters for searching on the properties of Items.

This extension replaces the deprecated 'Query' extension, swapping the custom query language with OGC's [CQL](http://docs.opengeospatial.org/DRAFTS/19-079.html)
([CQL repo](https://github.com/opengeospatial/ogcapi-features/tree/master/extensions/cql/)). It appears to still be a draft standard, 
but using it now in STAC API will enable us to provide key feedback, and STAC API will only go to 1.0.0 when there is a stable target 
to depend on. But CQL has been supported in a couple STAC Servers for awhile, and in the open source geospatial world for longer, so it 
should be pretty stable.

There are two flavors of CQL: `cql-text` and `cql-json`. STAC uses the former for HTTP GET requests, and the latter for HTTP POST requests. 
The [CQL](http://docs.opengeospatial.org/DRAFTS/19-079.html) standard is the definitive reference for both flavors, and should work as described
in the `/items` endpoints typical of an OGC API - Features implementation. STAC also uses the same constructs in the `/search` endpoint, in line
with CQL's description of '[Cross-collection queries](http://docs.opengeospatial.org/DRAFTS/19-079.html#filter-param-multiple-collections)'.

## Example

Before we dive deep into an overview of CQL, it is worth showing a concrete examples. A common query of STAC is to find items (implementing the EO 
extension) with cloud cover between 0 and 10%. This would look like: 

### cql-text (GET)

```http
/search?filter=eo:cloud_cover < 10 
```

### cql-json (POST)

```json
{
  "filter": {
               "gt": {
                  "property": "eo:cloud_cover",
                  "value": 0
               }
            }
}
```

## Filtering Overview

STAC's use of CQL requires full implementation of the "[Simple CQL](http://docs.opengeospatial.org/DRAFTS/19-079.html#cql-core) core 
requirements class. This includes a number of different operators: Comparison (equal to, less than, less than or equal to, greater than, 
greater than or equal to, like, is null, in and between), Logical operators (or, not), and then one each of a spatial operator (intersects) 
and a temporal operator (anyinteracts). There are then optional additions for [Enhanced Spatial 
Operators](http://docs.opengeospatial.org/DRAFTS/19-079.html#enhanced-spatial-operators) (like within, crosses, overlaps), [Enhanced Temporal 
Operators](http://www.opengis.net/spec/ogcapi-features-3/1.0/req/enhanced-temporal-operators) (after, begun by, ends, etc), 
[Functions](http://docs.opengeospatial.org/DRAFTS/19-079.html#functions) (ability to run operations, like 'sin' or 'max'), and [Arithmetric 
Expressions](http://docs.opengeospatial.org/DRAFTS/19-079.html#arithmetic) (multiply, add).

STAC only requires the Simple CQL requirements to be implemented, but the additional operations are allowed and encouraged. There is a 
[BNF Notation](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) for the CQL grammar (see 
[Annex B](http://docs.opengeospatial.org/DRAFTS/19-079.html#_cql_bnf_normative)), which should help implemententation, and there are also 
a handful of existing libraries that implement CQL. 

### Operator Overview

The following table aims to help get an idea of what the core CQL options are, and how they compare with the previous STAC 'query' language.

| **Operator**             | **cql-text**                                    | **cql-json**                                                                    | **stac-query** (deprecated)                                                  |
|--------------------------|-------------------------------------------------|---------------------------------------------------------------------------------|-----------------|
| equal to                 | prop = 5                                        | "eq": { "property": "prop", "value": 5}                                         | "prop": { "eq": 5 }                                                          |
| less than                | prop < 5                                        | "lt": { "property": "prop", "value": 5}                                         | "prop": { "lt": 5 }                                                          |
| less than or equal to    | prop lteq 5                                     | "lteq": { "property": "prop", "value": 5}                                       | "prop": { "lte": 5 }                                                         |
| greater than             | prop > 5                                        | "gt": { "property": "prop", "value": 5}                                         | "prop": { "gt": 5 }                                                          |
| greater than or equal to | prop gteq 5                                     | "gteq": { "property": "prop", "value": 5}                                       | "prop": { "gte": 5 }                                                         |
| like                     | prop LIKE r%ad                                  | "like": { "property": "prop","value": "r%ad" }                                  | n/a - only starts, ends & contains                                           |
| starts with              | prop LIKE road%                                 | "like": { "property": "prop","value": "road%" }                                 | "prop": { "startsWith": "road" }                                             |
| ends with                | prop LIKE %road                                 | "like": { "property": "prop", "value": "%road" } | "prop": { "endsWith": "road" }                                               |
| contains                 | prop LIKE %road%                                | "like": { "property": "prop", "value": "%road%" } | "prop": { "contains": "road" }                                               |
| and                      | (exp1) AND (exp2)                               |  "and": { (exp1) }, { (exp2) } |       { (exp1) }, { (exp2) } (everything is default AND'ed                   |
| or                       | (exp1) OR (exp2)                                | "or": { (exp1) }, { (exp2) }                                                    | not specified                                                                |
| not                      | NOT (exp1)                                      | "not": { (exp1) }                                                               | not specified                                                                |
| intersects               | INTERSECTS(geometry, POINT(-118,33.8))              | "intersects": { "property": "geometry", "value": { "type": "Point", "coordinates": \[33.8,-118\] } | "intersects": { "type": "Point", "coordinates": \[33.8,-118\] |
| anyinteracts             | prop ANYINTERACTS 2020-10-23T20:44:22.23        | "anyinteracts": { "property": "prop", "value": "2020-10-23T20:44:22.23"          | "datetime": "2020-10-23T20:44:22.23" |

#### filter-lang

To make a full request you should include the [`filter-lang`](http://docs.opengeospatial.org/DRAFTS/19-079.html#filter-lang-param) parameter. 
The values for CQL are `cql-text` and `cql-json`. The OGC specification says that the default value is `cql-text`, so if the parameter isn't
specified then requests with that should work.

```http
/search?filter-lang=cql-text&filter=eo:cloud_cover > 0 AND eo:cloud_cover < 10 
```

There is not yet a POST standard for OGC API - Features, but the way we fit it into STAC's POST is:

```json
{
  "bbox": [-110,39.5,-105,40.5],
  "datetime": "2018-02-12T00:00:00Z/2018-03-18T12:31:12Z",
  "filter-lang": "cql-json",
  "filter": {
    "and": [
              {
                 "gt": {
                    "property": "eo:cloud_cover",
                    "value": 0
                 }
              },
              {
                 "lt": {
                    "property": "eo:cloud_cover",
                    "value": 10
                 }
              }
          ]
    },
 "limit": 10
}
```

For now it is best to always include the `filter-lang` parameter here, but we will attempt to work with OGC API - Features to 
establish `cql-json` as the default, and servers should try to work with cql-json if the filter-lang isn't specified.
