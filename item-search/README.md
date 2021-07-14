# STAC API - Item Search

- [STAC API - Item Search](#stac-api---item-search)
  - [Query Parameters and Fields](#query-parameters-and-fields)
    - [Query Examples](#query-examples)
    - [Query Parameter Table](#query-parameter-table)
  - [Response](#response)
    - [Paging](#paging)
  - [HTTP Request Methods and Content Types](#http-request-methods-and-content-types)
    - [GET](#get)
    - [POST](#post)
      - [PUT / PATCH / DELETE](#put--patch--delete)
  - [Recommended Link Relations at `/`](#recommended-link-relations-at-)
  - [Example Landing Page for STAC API - Item Search](#example-landing-page-for-stac-api---item-search)
  - [Extensions](#extensions)
    - [Fields](#fields)
    - [Filter](#filter)
    - [Sort](#sort)
    - [Context](#context)
    - [Query](#query)

- **OpenAPI specification:** [openapi.yaml](openapi.yaml) ([rendered version](https://api.stacspec.org/v1.0.0-beta.2/item-search))
- **Conformance URI:** <https://api.stacspec.org/v1.0.0-beta.2/item-search>
- **Dependencies**: [STAC API - Core](../core)
- **Examples**: [examples.md](examples.md)

A search endpoint, linked to from the STAC landing page, provides the ability to query STAC [Item](../stac-spec/item-spec/README.md) 
objects across collections.
It retrieves a group of Item objects that match the provided parameters, wrapped in an 
[ItemCollection](../fragments/itemcollection/README.md) (which is a 
valid [GeoJSON FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3) that contains STAC Item objects). Several core
query parameters are defined by [OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html), with
a few additions specified in this document.

The Item Search endpoint intentionally defines only a limited group of operations. It is expected that 
most behavior will be defined in [Extensions](#extensions). These extensions can be composed by an implementer to 
cover only the set of functionality the implementer requires. For example, the query capability defined by 
Item Search is limited, and only adds cross-collection and spatial intersects query operators to the capabilities 
already defined by OAFeat. For example, the Query Extension (soon to be superseded by the Filter Extension) 
provides a more expressive set of operators. 

Implementing `GET /search` is **required**, `POST /search` is optional, but recommended.

It is **required** to add a Link to the root endpoint (`/`) with the `rel` type set to `search`
that refers to the search endpoint in the `href` property,
with a `type` of `application/geo+json` and a `method` of `GET`.
This link should look like:

```json
{
    "href": "https://example.com/search",
    "rel": "search",
    "title": "Search",
    "type": "application/geo+json",
    "method": "GET"
}
```

Implementations that support `POST` must add a second link with the same structure, but has a `method` of `POST`. 

## Query Parameters and Fields

The following list of parameters is used to narrow search queries. They can all be represented as query string parameters 
in a GET request, or as JSON entity fields in a POST request. For filters that represent a set of values, query parameters 
should use comma-separated string values with no enclosing brackets (\[ or \]) and no whitespace between values, and JSON entity attributes should use JSON Arrays. 

### Query Examples

```http
GET /search?collections=landsat8,sentinel&bbox=-10.415,36.066,3.779,44.213&limit=200&datetime=2017-05-05T00:00:00Z
```

```json
{
    "collections": ["landsat8","sentinel"],
    "bbox": [10.415,36.066,3.779,44.213],
    "limit": 200,
    "datetime": "2017-05-05T00:00:00Z"
}
```

For more examples see [examples.md](examples.md).

### Query Parameter Table

The core parameters for STAC search are defined by OAFeat, and STAC adds a few parameters for convenience.

| Parameter    | Type             | Source API   | Description |
| -----------  | ---------------- | ------------ | ----------- |
| limit        | integer          | OAFeat       | The maximum number of results to return (page size). Defaults to 10 |
| bbox         | \[number]        | OAFeat       | Requested bounding box. |
| datetime     | string           | OAFeat       | Single date+time, or a range ('/' separator), formatted to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). Use double dots `..` for open date ranges. |
| intersects   | GeoJSON Geometry | STAC         | Searches items by performing intersection between their geometry and provided GeoJSON geometry.  All GeoJSON geometry types must be supported. |
| ids          | \[string]        | STAC         | Array of Item ids to return. |
| collections  | \[string]        | STAC         | Array of one or more Collection IDs that each matching Item must be in. |

Only one of either **intersects** or **bbox** should be specified.  If both are specified, a 400 Bad Request response 
should be returned. See [examples](examples.md) to see sample requests.

**bbox** Represented using either 2D or 3D geometries. The length of the array must be 2\*n where n is the number of dimensions. The array contains all axes of the southwesterly most extent followed by all axes of the northeasterly most extent specified in Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84). When using 3D geometries, the elevation of the southwesterly most extent is the minimum elevation in meters and the elevation of the northeasterly most extent is the maximum.  


## Response

The response to a request (GET or POST) to the search endpoint should always be an 
[ItemCollection](../fragments/itemcollection/README.md) object - a valid [GeoJSON 
FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3) that consists entirely of STAC 
[Item](../stac-spec/item-spec/item-spec.md) objects. 

### Paging

OGC API supports paging through hypermedia links and STAC follows the same pattern for the cross collection search. For 
GET requests, a link with `rel` type `next` is supplied.  This link may contain any URL parameter that is necessary 
for the implementation to understand how to provide the next page of results, eg: `page`, `next`, `token`, etc.  The 
parameter name is defined by the implementor and is not necessarily part of the API specification.  For example:

```json
{
    "type": "FeatureCollection",
    "features": [],
    "links": [
        {
            "rel": "next",
            "href": "http://api.cool-sat.com/search?page=2"
        }
    ]
}
```

The href may contain any arbitrary URL parameter:

- `http://api.cool-sat.com/search?page=2`
- `http://api.cool-sat.com/search?next=8a35eba9c`
- `http://api.cool-sat.com/search?token=f32890a0bdb09ac3`

OAFeat does not support POST requests for searches, however the STAC API spec does. Hypermedia links are not designed 
for anything other than GET requests, so providing a next link for a POST search request becomes problematic. STAC has 
decided to extend the `link` object to support additional fields that provide hints to the client as to how it should 
execute a subsequent request for the next page of results.

The following fields have been added to the `link` object specification for the API spec:

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| method    | string  | The HTTP method of the request, usually `GET` or `POST`. Defaults to `GET` |
| headers   | object  | A dictionary of header values that should be included in the next request |
| body      | object  | A JSON object containing fields/values that should be included in the body of the next request |
| merge     | boolean | If `true`, the headers/body fields in the `next` link should be merged into the original request and be sent combined in the next request. Defaults to `false` |

The implementor has the freedom to decide exactly how to apply these extended fields for their particular pagination 
mechanism.  The same freedom that exists for GET requests, where the actual URL parameter used to defined the next page 
of results is purely up to the implementor and not defined in the API spec, if the implementor decides to use headers, 
there are no specific or required header names defined in the specification.  Implementors may use any names or fields 
of their choosing. Pagination can be provided solely through header values, solely through body values, or through some 
combination.  

To avoid returning the entire original request body in a POST response which may be arbitrarily large, the  `merge` 
property can be specified. This indicates that the client should send the same post body that it sent in the original 
request, but with the specified headers/body values merged in. This allows servers to indicate what needs to change 
to get to the next page without mirroring the entire query structure back to the client.

See the [paging examples](examples.md#paging-examples) for additional insight.

## HTTP Request Methods and Content Types

The STAC API follow a RESTful model. A core principal of this is the use of HTTP Request Methods ("verbs") and
the `Content-Type` header to drive behavior on resources ("nouns"). This section describes how these are used with the `/search` endpoint 

### GET

**Required**: STAC's cross-collection `/search` requires GET queries for all implementations, following OAFeat's precedent of 
making GET required (it only specifies GET so far). 

### POST

**Recommended** STAC `/search` is strongly recommended to implement POST `Content-Type: application/json`, where the content body is a JSON 
object representing a query and filter, as defined in this document. 

It is recommended that clients use POST for querying (if the STAC API supports it), especially when using the 
`intersects` query parameter, for two reasons:

1. In practice, the allowed size for an HTTP GET request is significantly less than that allowed for a POST request, 
so if a large geometry is used in the query it may cause a GET request to fail.
2. The parameters for a GET request must be escaped properly, making it more difficult to construct when using JSON 
parameters (such as intersect, as well as additional filters from the query extension).

**STAC API extensions** allow for more sophisticated searching, such as the ability to sort, select which fields you want returned, and 
searching on specific Item properties.

#### PUT / PATCH / DELETE

The other HTTP verbs are not supported in STAC Item Search. The [Transaction Extension](../ogcapi-features/extensions/transaction/README.md)
does implement them, for STAC and OAFeat implementations that want to enable writing and deleting items.

## Recommended Link Relations at `/`

When implementing the STAC API - Item Search conformance class, it it recommended to implement these Link relations.

| **`rel`** | **href to**                                | **From**           | **Description**                                                  |
|-----------|--------------------------------------------|--------------------|------------------------------------------------------------------|
| `root`    | The root URI                               | STAC Core          | Reference to self URI |
| `self`    | The root URI                               | OAFeat             | Reference to self URI  |
| `service-desc` | The OpenAPI service description       | OAFeat OpenAPI   | Uses the `application/vnd.oai.openapi+json;version=3.0` media type to refer to the OpenAPI 3.0 document that defines the service's API |
| `service-doc`  | An HTML service description           | OAFeat OpenAPI   | Uses the `text/html` media type to refer to a human-consumable description of the service |
| `child`   | The child STAC Catalogs & Collections      | STAC Core          | Provides curated paths to get to STAC Collection and Item objects      |
| `search`  | The STAC search endpoint (often `/search`) | STAC Search        | Cross-collection query endpoint to select sub-sets of STAC Item objects |

It is also valid to have `item` links from the landing page, but most STAC API services are used to 
serve up a large number of features, so they typically
use several layers of intermediate `child` links before getting to Item objects.

## Example Landing Page for STAC API - Item Search

This JSON is what would be expected from an api that only implements STAC API - Item Search. In practice, 
most APIs will also implement other conformance classes, and those will be reflected in the `links` and 
`conformsTo` fields.  A more typical Landing Page example is in 
the [overview](../overview.md#example-landing-page) document.

```json
{
    "stac_version": "1.0.0",
    "id": "example-stac",
    "title": "A simple STAC API Example",
    "description": "This Catalog aims to demonstrate the a simple landing page",
    "conformsTo" : [
        "https://api.stacspec.org/v1.0.0-beta.2/core",
        "https://api.stacspec.org/v1.0.0-beta.2/item-search"
    ],
    "links": [
        {
            "rel": "self",
            "type": "application/json",
            "href": "https://stacserver.org"
        },
        {
            "rel": "root",
            "type": "application/json",
            "href": "https://stacserver.org"
        },
        {
            "rel": "service-desc",
            "type": "application/vnd.oai.openapi+json;version=3.0",
            "href": "https://stacserver.org/api"
        },
        {
            "rel": "service-doc",
            "type": "text/html",
            "href": "https://stacserver.org/api.html"
        },
        {
            "rel": "search",
            "type": "application/geo+json",
            "href": "https://stacserver.org/search"
        }
    ]
}
```

## Extensions

These extensions provide additional functionality that enhances the core item search. All are specified as 
[fragments](../fragments), as they are re-used by other extensions STAC API's that offer the following capabilities at
the `search` endpoint must include the relevant **conformance URI** in the `conformsTo` response at
the root (`/`) landing page, to indicate to clients that they will respond properly to requests from clients.

### Fields

- **Conformance URI:** <https://api.stacspec.org/v1.0.0-beta.2/item-search#fields>
- **Extension [Maturity Classification](../extensions.md#extension-maturity):** Pilot
- **Definition**: [STAC API - Fields Fragment](../fragments/fields/)

By default, the STAC search endpoint `/search` returns all attributes of each Item, as there is no way to specify 
exactly those attributes that should be returned. The Fields extension to Item Search adds new functionality that 
allows the client to suggest to the server which Item attributes should be included or excluded in the response, 
through the use of a `fields` parameter. The full description of how this extension works can be found in the 
[fields fragment](../fragments/fields/). 

### Filter

- **Conformance URI:** <https://api.stacspec.org/v1.0.0-beta.2/item-search#filter>
- **Extension [Maturity Classification](../extensions.md#extension-maturity):** Pilot
- **Definition**: [STAC API - Filter Fragment](../fragments/filter/)

The STAC search endpoint, `/search`, by default only accepts a limited set of parameters to limit the results
by properties. The Filter extension adds a new parameter, `filter`, that can take a number of comparison operators to
match predicates between the fields requested and the values of Item objects. It can be used with both GET and POST and supports two
query formats, `cql-text` and `cql-json`. The full details on the JSON structure are specified in the [filter 
fragment](../fragments/filter/).

### Sort

- **Conformance URI:** <https://api.stacspec.org/v1.0.0-beta.2/item-search#sort>
- **Extension [Maturity Classification](../extensions.md#extension-maturity):** Pilot
- **Definition**: [STAC API - Sort Fragment](../fragments/sort/)

By default, the STAC search endpoint `/search` returns results in no specified order. Whatever order the results are in 
is up to the implementor, and will typically default to an arbitrary order that is fastest for the underlying data store 
to retrieve results. This extension adds a new parameter, `sortby`, that lets a user specify a comma separated list of
field names to sort by, with an indication of direction. It can be used with both GET and POST, the former using '+' and
'-' to indicate sort order, and the latter including a 'direction' field in JSON. The full description of the semantics
of this extension can be found in the [sort fragment](../fragments/sort).

### Context

- **Conformance URI:** <https://api.stacspec.org/v1.0.0-beta.2/item-search#context>
- **Extension [Maturity Classification](../extensions.md#extension-maturity):** Pilot
- **Definition**: [STAC API - Context Fragment](../fragments/context/)

This extension is intended to augment the core ItemCollection responses from the `search` API endpoint with a
JSON object called `context` that includes the number of items `matched`, `returned` and the `limit` requested.
The full description and examples of this are found in the [context fragment](../fragments/context).

### Query

- **Conformance URI:** <https://api.stacspec.org/v1.0.0-beta.2/item-search#query>
- **Extension [Maturity Classification](../extensions.md#extension-maturity):** Pilot, scheduled to be Deprecated
- **Definition**: [STAC API - Query Fragment](../fragments/query/)

**Note** - the Query Extension will be deprecated at some point in 1.x. Implementers
are encouraged to use the Filter Extension instead.

The STAC search endpoint, `/search`, by default only accepts a limited set of parameters to limit the results
by properties. The Query extension adds a new parameter, `query`, that can take a number of comparison operators to
match predicates between the fields requested and the values of Item objects. It can be used with both GET and POST, though
GET includes the exact same JSON. The full details on the JSON structure are specified in the [query 
fragment](../fragments/query/).
