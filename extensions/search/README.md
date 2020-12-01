# STAC API Search

| **Name**      | **Conformance URI**                                           | **Dependencies** |
|-------------|-------------------------------------------------------------|------------------|
| STAC Search | <http://stacspec.org/spec/api/1.0.0-beta.1/req/stac-search> | STAC API Core    |

A search endpoint, linked to from the STAC landing page, provides the ability to query STAC `Items` across collections.
It retrieving a group of Items that match the provided search predicates, wrapped in an ItemCollection (which is a 
valid [GeoJSON FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3) that contains STAC Items).

If a search endpoint is implemented, it is **required** to add a Link to the root endpoint (`/`) with the `rel` type set to `search`
that refers to the search endpoint in the `href` property, with a `type` of `application/geo+json`.
This link should look like:

```json
{
    "href": "https://example.com/search",
    "rel": "search",
    "title": "Search",
    "type": "application/geo+json"
}
```

## Query Parameters and Fields

The following list of parameters is used to narrow search queries. They can all be represented as query string parameters 
in a GET request, or as JSON entity fields in a POST request. For filters that represent a set of values, query parameters 
should use comma-separated string values (with no outer brackets \[ or \]) and JSON entity attributes should use JSON Arrays. 

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

### Query Parameter Table

The core parameters for STAC search are defined by OAFeat, and STAC adds a few parameters for convenience.

| Parameter    | Type             | Source API   | Description |
| -----------  | ---------------- | ------------ | ----------- |
| limit        | integer          | OAFeat       | The maximum number of results to return (page size). Defaults to 10 |
| bbox         | \[number]        | OAFeat       | Requested bounding box.  Represented using either 2D or 3D geometries. The length of the array must be 2*n where n is the number of dimensions. The array contains all axes of the southwesterly most extent followed by all axes of the northeasterly most extent specified in Longitude/Latitude or Longitude/Latitude/Elevation based on [WGS 84](http://www.opengis.net/def/crs/OGC/1.3/CRS84). When using 3D geometries, the elevation of the southwesterly most extent is the minimum elevation in meters and the elevation of the northeasterly most extent is the maximum. |
| datetime     | string           | OAFeat       | Single date+time, or a range ('/' seperator), formatted to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). Use double dots `..` for open date ranges. |
| intersects   | GeoJSON Geometry | STAC         | Searches items by performing intersection between their geometry and provided GeoJSON geometry.  All GeoJSON geometry types must be supported. |
| ids          | \[string]        | STAC         | Array of Item ids to return. All other filter parameters that further restrict the number of search results (except `next` and `limit`) are ignored |
| collections  | \[string]        | STAC         | Array of one or more Collection IDs to include in the search for items. Only Items in one of the provided Collections will be searched |

Only one of either **intersects** or **bbox** should be specified.  If both are specified, a 400 Bad Request response 
should be returned. See [examples](#examples) to see sample requests.

### Reserved Parameters

 Additionally, there are several reserved parameters over STAC search that have no meaning in the base STAC API 
 specification, but which are reserved exclusively for the use of API Extensions.  API implementations are free to 
 add additional implementation-specific parameters, but they **MUST NOT** use following parameters unless implementing 
 the syntax and semantics of an API Extension attached to that parameter.  If no API Extension for that parameter is 
 implemented by an API, then if that parameter has a non-empty value in the request a 400 Bad Request status code must 
 be returned. 

| Parameter | Type               | Description |
| --------- | ------------------ | ----------- |
| fields    | string \| \[Field] | Placeholder parameter for [API Fields Extension](extensions/fields/README.md), used to request specific properties in the response. |
| sort      | string \| \[Sort] | Placeholder parameter for [API Sort Extension](extensions/sort/README.md), used to order the responses by property. |
| query     | string \| QueryFilter | Placeholder parameter for [API Query Extension](extensions/query/README.md) query value. |

## GET & POST

A GET response from the search endpoint is **required**. POST is optional, but recommended.

## Response

The response to a request (GET or POST) to the search endpoint should always be an `ItemCollection` - a valid [GeoJSON 
FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3) that consists entirely of STAC 
[Items](stac-spec/item-spec/item-spec.md). 

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

#### Examples

##### Simple GET based search
Request:
```http
HTTP GET /search?bbox=-110,39.5,-105,40.5
```

Response with `200 OK`:
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
Following the link `http://api.cool-sat.com/search?page=2` will send the user to the next page of results.

##### POST search with body and merge fields
Request to `HTTP POST /search`:
```json
{
    "bbox": [-110, 39.5, -105, 40.5]
}
```

Response with `200 OK`:
```json
{
    "type": "FeatureCollection",
    "features": [],
    "links": [
        {
            "rel": "next",
            "href": "http://api.cool-sat.com/search",
            "method": "POST",
            "body": {
                "page": 2,
                "limit": 10
            },
            "merge": true
        }
    ]
}
```

This tells the client to POST to the search endpoint using the original request with the `page` and `limit` fields 
merged in to obtain the next set of results:

Request to `POST /search`:
```json
{
    "bbox": [-110, 39.5, -105, 40.5],
    "page": 2,
    "limit": 10
}
```

This can be even more effective when using continuation tokens on the server, as the entire request body need not be 
repeated in the subsequent request:

Response with `200 OK`:
```json
{
    "rel": "next",
    "href": "http://api.cool-sat.com/search",
    "method": "POST",
    "body": {
        "next": "a9f3kfbc98e29a0da23"
    }
}
```
The above link tells the client not to merge (default of false) so it is only required to pass the next token in the body.

Request to `POST /search`:
```json
{
    "next": "a9f3kfbc98e29a0da23"
}
```

##### POST search using headers
Request to `HTTP POST /search`:
```json
{
    "bbox": [-110, 39.5, -105, 40.5],
    "page": 2,
    "limit": 10
}
```

Response with `200 OK`:
```json
{
    "type": "FeatureCollection",
    "features": [],
    "links": [
        {
            "rel": "next",
            "href": "http://api.cool-sat.com/search",
            "method": "POST",
            "headers": {
                "Search-After": "LC81530752019135LGN00"
            }
        }
    ]
}
```

This tells the client to POST to the search endpoint with the header `Search-After` to obtain the next set of results:

Request:
```http
POST /search
Search-After: LC81530752019135LGN00
```

## HTTP Request Methods and Content Types

The OAFeat and STAC APIs follow a RESTful model. A core principal of this is the use of HTTP Request Methods ("verbs") and
the `Content-Type` header to drive behavior on resources ("nouns"). This section describes how these are used in the OAFeat and STAC endpoints. 

### GET

**Required**: OAFeat 1.0 only specifies GET query parameters, and they are all required. STAC's cross-collection `/search` also requires
GET queries for all implementations, and generally aligns with OAFeat's single Collection search. 

### POST

1. **Recommended** STAC `/search` is strongly recommended to implement POST `Content-Type: application/json`, where the content body is a JSON 
object representing a query and filter, as defined in the [STAC API OpenAPI specification document](STAC.yaml). 
2. **Prohibited** OAFeat: POST `Content-Type: application/json` on the `/collections/{collectionId}/items`, where the content body is a JSON 
object representing a filter, is not allowed. This is prohibited due to conflict with the 
[Transaction Extension](extensions/transaction/README.md), which defines a POST `Content-Type: application/json` 
operation to create an Item. Any query against a single OAFeat collection endpoint should be possible against the STAC `/search` endpoint, specifying
the collection name in the `collections` query parameter.

It is recommended for clients use POST for querying (if the STAC API supports it), especially when using the 
`intersects` query parameter, for two reasons:

1. In practice, the allowed size for an HTTP GET request is significantly less than that allowed for a POST request, 
so if a large geometry is used in the query it may cause a GET request to fail.
2. The parameters for a GET request must be escaped properly, making it more difficult to construct when using JSON 
parameters (such as intersect).

**STAC API extensions** allow for more sophisticated searching, such as the ability to search by geometries and 
searching on specific Item properties.

#### PUT / PATCH / DELETE

The other HTTP verbs are not supported in the core STAC specification. The [Transaction Extension](extensions/transaction/README.md)
does implement them, for STAC and OAFeat implementations that want to enable writing and deleting items. 
