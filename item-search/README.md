# STAC API - Item Search

- [STAC API - Item Search](#stac-api---item-search)
  - [Link Relations](#link-relations)
  - [Endpoints](#endpoints)
  - [Query Parameters and Fields](#query-parameters-and-fields)
    - [Query Examples](#query-examples)
    - [Query Parameter Table](#query-parameter-table)
  - [Response](#response)
    - [Pagination](#pagination)
  - [HTTP Request Methods and Content Types](#http-request-methods-and-content-types)
    - [GET](#get)
    - [POST](#post)
      - [PUT / PATCH / DELETE](#put--patch--delete)
  - [Example Landing Page for STAC API - Item Search](#example-landing-page-for-stac-api---item-search)
  - [Extensions](#extensions)

The *STAC API - Item Search* specification defines the *STAC API - Item Search*
conformance class (<https://api.stacspec.org/v1.0.0-rc.2/item-search>), which
provides the ability to search for STAC [Item](../stac-spec/item-spec/README.md)
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
already defined by OAFeat. For example, the Query Extension and Filter Extension
provide a more expressive set of operators.

Implementing `GET /search` is **required**, `POST /search` is optional, but recommended.

## Link Relations

This conformance class also requires implementation of the link relations in the [STAC API - Core](../core) conformance class.

The following Link relations must exist in the Landing Page (root).

| **rel**  | **href**  | **From**               | **Description**             |
| -------- | --------- | ---------------------- | --------------------------- |
| `search` | `/search` | STAC API - Item Search | URI for the Search endpoint |

This `search` link relation must have a `type` of `application/geo+json`. If no `method` attribute is
specified, it is assumed to represent a GET request. If the server supports both GET and POST requests, two links should be included, one with a `method` of `GET` one with a `method` of `POST`.

Other links with relation `search` may be included that advertise other content types the server may respond
with, but these other types are not part of the STAC API requirements.

## Endpoints

This conformance class also requires for the endpoints in the [STAC API - Core](../core) conformance class to be implemented.

| Endpoint  | Returns         | Description     |
| --------- | --------------- | --------------- |
| `/search` | Item Collection | Search endpoint |

## Query Parameters and Fields

The following list of parameters is used to narrow search queries. They can all be represented as query
string parameters in a GET request, or as JSON entity fields in a POST request. For filters that represent
a set of values, query parameters must use comma-separated string values with no enclosing brackets
(\[ or \]) and no whitespace between values, and JSON entity attributes must use JSON Arrays.

### Query Examples

```
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

| Parameter   | Type             | Source API | Description                                                                                                                                                                     |
| ----------- | ---------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| limit       | integer          | OAFeat     | The maximum number of results to return (page size).                                                                                                                            |
| bbox        | \[number]        | OAFeat     | Requested bounding box.                                                                                                                                                         |
| datetime    | string           | OAFeat     | Single date+time, or a range ('/' separator), formatted to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). Use double dots `..` for open date ranges. |
| intersects  | GeoJSON Geometry | STAC       | Searches items by performing intersection between their geometry and provided GeoJSON geometry.  All GeoJSON geometry types must be supported.                                  |
| ids         | \[string]        | STAC       | Array of Item ids to return.                                                                                                                                                    |
| collections | \[string]        | STAC       | Array of one or more Collection IDs that each matching Item must be in.                                                                                                         |

See [examples](examples.md) for some example requests.

**limit** The limit parameter follows the same semantics of the OAFeat Item resource limit parameter. The value is
a suggestion to the server as to the maximum number of Item objects the
client would prefer in the response. The server may return fewer Item objects, but
must not return more. The OpenAPI specification defines the default and maximum values
for this parameter. The base specifications define these with a default of 10 and a maximum of 10000, but implementers
may choose other values to advertise through their `service-desc` endpoint.  If the limit parameter value is greater
than the advertised maximum limit, the server must act as if the request were for the maximum
and not return an error.

Only one of either **intersects** or **bbox** may be specified.  If both are specified, a 400 Bad Request status code
must be returned.

**datetime** The datetime parameter use the same allowed values as the
[OAF datetime](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_parameter_datetime) parameter.
This allows for either a single [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) datetime or an
open or closed interval that also uses RFC 3339 datetimes. Additional details about this parameter can be
found in the [Implementation Recommendations](../implementation.md#datetime-parameter-handling).

**bbox** Represented using either 2D or 3D geometries. The length of the array must be 2\*n where
*n* is the number of dimensions. The array contains all axes of the southwesterly most extent
followed by all axes of the northeasterly most extent specified in Longitude/Latitude or
Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84).
When using 3D geometries, the elevation of the southwesterly most extent is the minimum elevation
in meters and the elevation of the northeasterly most extent is the maximum. When filtering with
a 3D bbox over Items with 2D geometries, it is assumed that the 2D geometries are at
elevation 0.

## Response

The response to a request (GET or POST) to the search endpoint must always be an
[ItemCollection](../fragments/itemcollection/README.md) object - a valid [GeoJSON
FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3) that consists entirely of STAC
[Item](../stac-spec/item-spec/item-spec.md) objects.

### Pagination

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
            "href": "https://stac-api.example.com/search?page=3",
            "type": "application/geo+json"

        },
        {
            "rel": "prev",
            "href": "https://stac-api.example.com/search?page=1",
            "type": "application/geo+json"
        }
    ]
}
```

The href may contain any arbitrary URL parameter:

- `https://stac-api.example.com/search?page=2`
- `https://stac-api.example.com/search?next=8a35eba9c`
- `https://stac-api.example.com/search?token=f32890a0bdb09ac3`

Implementations may also add link relations `prev`, `first`, and `last`, though these are not required and may
be infeasible to implement in some data stores.

OAFeat does not support POST requests for searches, however the STAC API spec does. Hypermedia links are not designed
for anything other than GET requests, so providing a next link for a POST search request becomes problematic. STAC has
decided to extend the Link object to support additional fields that provide hints to the client as to how it must
execute a subsequent request for the next page of results.

The following fields have been added to the Link object specification for the API spec:

| Parameter | Type    | Description                                                                                                                                                  |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| method    | string  | The HTTP method of the request, usually `GET` or `POST`. Defaults to `GET`                                                                                   |
| headers   | object  | A dictionary of header values that must be included in the next request                                                                                      |
| body      | object  | A JSON object containing fields/values that must be included in the body of the next request                                                                 |
| merge     | boolean | If `true`, the headers/body fields in the `next` link must be merged into the original request and be sent combined in the next request. Defaults to `false` |

The implementor has the freedom to decide exactly how to apply these extended fields for their particular pagination
mechanism.  The same freedom that exists for GET requests, where the actual URL parameter used to defined the next page
of results is purely up to the implementor and not defined in the API spec, if the implementor decides to use headers,
there are no specific or required header names defined in the specification.  Implementors may use any names or fields
of their choosing. Pagination can be provided solely through header values, solely through body values, or through some
combination.

To avoid returning the entire original request body in a POST response which may be arbitrarily large, the  `merge`
property can be specified. This indicates that the client must send the same post body that it sent in the original
request, but with the specified headers/body values merged in. This allows servers to indicate what needs to change
to get to the next page without mirroring the entire query structure back to the client.

See the [paging examples](examples.md#paging-examples) for additional insight.

## HTTP Request Methods and Content Types

STAC APIs follow the modern web API practices of using HTTP Request Methods ("verbs") and
the `Content-Type` header to drive behavior on resources ("nouns").
This section describes how these are used with the `/search` endpoint.

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

The other HTTP verbs are not supported in STAC Item Search. The [Transaction Extension](https://github.com/stac-api-extensions/transaction)
does implement them, for STAC and OAFeat implementations that want to enable writing and deleting items.

## Example Landing Page for STAC API - Item Search

This JSON is what would be expected from an api that only implements *STAC API - Item Search*. In practice,
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
        "https://api.stacspec.org/v1.0.0-rc.2/core",
        "https://api.stacspec.org/v1.0.0-rc.2/item-search"
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
            "rel": "service-desc",
            "type": "application/vnd.oai.openapi+json;version=3.1",
            "href": "https://stac-api.example.com/api"
        },
        {
            "rel": "service-doc",
            "type": "text/html",
            "href": "https://stac-api.example.com/api.html"
        },
        {
            "rel": "search",
            "type": "application/geo+json",
            "href": "https://stac-api.example.com/search",
            "method": "GET"
        },
        {
            "rel": "search",
            "type": "application/geo+json",
            "href": "https://stac-api.example.com/search",
            "method": "POST"
        }
    ]
}
```

## Extensions

These extensions provide additional functionality that enhances Item Search.

- [Fields Extension](https://github.com/stac-api-extensions/fields/blob/main/README.md)
- [Sort Extension](https://github.com/stac-api-extensions/sort/blob/main/README.md)
- [Context Extension](https://github.com/stac-api-extensions/context/blob/main/README.md)
- [Filter Extension](https://github.com/stac-api-extensions/filter/blob/main/README.md)
- [Query Extension](https://github.com/stac-api-extensions/query/blob/main/README.md)
