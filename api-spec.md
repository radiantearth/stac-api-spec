# STAC API Specification

## About

The STAC API defines a RESTful JSON-based server to query [SpatioTemporal Asset Catalogs](stac-spec/) 
(STAC). While the core STAC specification provides a structure and language to describe assets, users usually want to access
a subset of the entire catalog, such as for a certain date range, in a particular area of interest, or matching properties
they care about. STAC API specifies those query parameters, and compliant servers return collections of STAC Items that
match the user's preferences. Most of STAC API's mechanics are specified by [OGC API](https://ogcapi.ogc.org/) family of
standards, particularly [OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html) (OAFeat, for our
shorthand). 

## Overview

The core of STAC API simply returns a valid [STAC Catalog](stac-spec/catalog-spec/catalog-spec.md) and a description
of what parts of the fuller STAC API specification it conforms to. The `links` section of the Catalog is the jumping
off point for the more powerful capabilities - it contains a list of URL's, each described by particular link 
'relationships' (`rel`) to indicate their functionality. Note that the [STAC Core specification](stac-spec) provides 
most all the content of API responses - the STAC API is primarily concerned with the return of STAC 
[Items](stac-spec/item-spec/README.md) and [Collections](stac-spec/collection-spec/README.md) through API functionality.

The search functionality is one of the most common, provided by the `search` rel often located at a `/search` endpoint. 
It re-uses all of the OAFeat [query parameters](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_items_) specified 
in their 'core', and adds a couple more. It does not require a full implementation of OAFeat, it is instead a simplified 
construct that can run a search across any set of indexed STAC [`Items`](stac-spec/item-spec/README.md). 

The other most common link relationship is `data` (usually at the `/collections` endpoint), which links to a complete 
list of available 'Collections', along with a mechanism to request individual collections by ID. These are specified in the 
'[Collections](http://docs.opengeospatial.org/DRAFTS/20-024.html#rc_collections-section)' section of OGC API Common. 
STAC's [Collection](stac-spec/collection-spec/README.md) extends the OGC Collection with a handful of [additional 
fields](stac-spec/collection-spec/collection-spec.md#collection-fields). STAC API's are expected to return STAC
compliant Collections.

Some STAC API implementations only describe their Collections, without providing search of individual Items, indeed they may not 
have Items. Many implementations go further than just providing the `search` rel by becoming fully compliant with
[OGC API - Features Core](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_requirements_class_core), implementing
following their [GeoJSON](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_requirements_class_geojson) and 
[OpenAPI](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_requirements_class_openapi_3_0) options, as STAC 
is always in GeoJSON and OpenAPI is used to specify STAC API. Full compliance involves splitting STAC `Items` into
individual `/collections/{collectionId}/items` endpoints that expose querying single collections, as OAFeat does
not currently allow cross-collection search. And it adds a few other requirements, explained below. 

Both STAC API and OAFeat allow 'extensions' that can be added for additional functionality.
We are working to fully merge the extensions, so that every STAC extension is specified at the OGC API level, and
STAC API just presents a curated set of extension options. 

### Capabilities

The following table describes the service resources available in a full STAC API implementation. Note that the 'Endpoint'
column is more of an example in most cases. OGC API makes some endpoint locations required, those will be bolded below.

| Endpoint                                        | Link Relationship  | Returns                                           | Description |
| ----------------------------------------------- | ------------------ | ------------------------------------------------- | ----------- |
| `/`                                             | root               | [Catalog](stac-spec/catalog-spec/catalog-spec.md) | Extends `/` from OAFeat to return a full STAC catalog. |
| `/search`                                       | search             | ItemCollection | Retrieves a group of Items matching the provided search predicates, probably containing search metadata from the `search` extension |
| **`/collections`**                                  | data               | JSON           | Object with a list of Collections contained in the catalog and links |
| **`/conformance`**                              | conformance        | JSON | Info about standards to which the API conforms |
| `/api`                                          | service-desc       | OpenAPI 3.0 JSON | The OpenAPI definition of the endpoints in this service            |
| **`/collections/{collectionId}`**               | collection         | Collection     | Returns single Collection JSON |
| **`/collections/{collectionId}/items`**         | items                   | ItemCollection | GeoJSON FeatureCollection-conformant entity of Items in collection |
| **`/collections/{collectionId}/items/{featureId}`** | Item           | Returns single Item (GeoJSON Feature) |

### Conformance Classes

STAC API is evolving to utilize OAFeat's 
'[Conformance](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_declaration_of_conformance_classes)' JSON structure. For 
STAC API 1.0.0-beta.1 we declare new STAC Conformance classes, and specify which OAFeat ones to use. These are detailed in the relevant
sections below.The core STAC conformance classes communicate the conformance JSON only in the root (`/`) document, while OGC API 
requires they also live at the `/conformance` endpoint. 

**NOTE:** *By 1.0.0 we aim to have requirements classes specified in detail, as testable assertions, 
like OGC does, but for now the core reference is just this spec document and the OpenAPI yaml. We also desire to have the
URI's for conformance to actually resolve to machine-readable information clients can use.*

**Work In Progress**: The below is still in flux - with just the headings fleshed out.

## STAC Core and OGC Versions

This version of STAC API depends on OGC API - Features - Part 1: Core [Version 1.0](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html),
and on [OGC API - Commons - Part 2: Collections](https://github.com/opengeospatial/ogcapi-common/blob/cc8ca2f011d7e1b19721268c4bf2b97c163d160a/20-024.pdf)
from the [August 18 V2 Commit](https://github.com/opengeospatial/ogcapi-common/tree/cc8ca2f011d7e1b19721268c4bf2b97c163d160a/collections) 
(we hope they will publish at least a 'beta' version that we can point to soon).

This version of STAC API is intended to work with any STAC core specification version 0.9.x or 1.x.x (included betas), but is not 
designed to work with STAC 2.0 and above (since we use [SemVer](https://semver.org/) it may introduce backwards incompatible changes). 
The STAC API spec is released with the latest stable STAC core specification version included in the [`/stac-spec`](stac-spec/) 
directory as a [submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules). To determine which version it is just check the 
[`/stac-spec/CHANGELOG.md`](stac-spec/CHANGELOG.md) for the topmost version & release date.

## STAC API 

The STAC API is broken up into a number of discrete parts, specified by 'Conformance Classes'. The only one required to be considered
a valid STAC API is 'STAC API Core', but the majority of implementations will implement at least 'STAC Search' or 'Commons Collections'. 
A majority of the conformance classes are defined by OGC (Commons and OAFeat), and the number will likely increase as OGC capabilities 
expand and STAC works to align.

| **Name**                  | **API** | **Conformance URI**                                                      | **Description**                                                                                                                                        |
|---------------------------|--------|----------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| STAC API Core             | STAC   | <http://stacspec.org/spec/api/1.0.0-beta.1/req/stac-api-core>      | Specifies the STAC Landing page `/`, communicating conformance and available endpoints.          |
| STAC Search               | STAC   | <http://stacspec.org/spec/api/1.0.0-beta.1/req/stac-search>      | Enables search of all STAC Items on the server, with the STAC `[/search](#stac-api-endpoints)` endpoint.               |
| OACommon Collections       | OACommon | <http://www.opengis.net/spec/ogcapi_common-2/1.0/req/collections> | Provides listing of OGC API Collections ([reference](http://docs.opengeospatial.org/DRAFTS/20-024.html#rc_collections-section)) |
| STAC Response             | STAC | <http://stacspec.org/spec/api/1.0.0-beta.1/req/stac-response>    | Specifies that OAFeat's relevant responses conform to STAC: STAC Collections for OGC API Commons - [collections](http://docs.opengeospatial.org/DRAFTS/20-024.html#rc_collections-section) & STAC Items for OGC API's [Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_items_) Collections from the OAFeat `/collections` and `/collections/{collectionId}` endpoints.            |
| OAFeat Core               | OAFeat | <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core>    | The core OGC API - Features endpoints & parameters Returns one or more STAC Collections from the OAFeat `/collections` and `/collections/{collectionId}` endpoints. Depends on OAFeat Core.         ([reference](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#rc_core))                         |
| OpenAPI specification 3.0 | OAFeat | <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30>   | Describes the API as OpenAPI 3.0 ([reference](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#rc_oas30))                                          |
| GeoJSON                   | OAFeat | <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson> | Requires OGC API - Features responses to be in GeoJSON ([reference](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_requirements_class_geojson)) |                                             |

Additional conformance classes are specified in the [STAC Extensions](extensions/README.md).

### STAC API Core

| **Name**      | **Conformance URI**                                           | **Dependencies** |
|---------------|---------------------------------------------------------------|------------------|
| STAC API Core | <http://stacspec.org/spec/api/1.0.0-beta.1/req/stac-api-core> | None             |

The core of a STAC API is its landing page, which is the starting point to discover STAC data and what the API supports.

```json
{
    "stac_version": "1.0.0-beta.2",
    "id": "example-stac",
    "title": "A simple STAC API Example",
    "description": "This Catalog aims to demonstrate the a simple landing page",
    "links": [
        {
            "rel": "child",
            "href": "https://stacserver.org/collections/sentinel-2",
        },
        {
            "rel": "child",
            "href": "https://stacserver.org/collections/landsat-8",
        },
        {
            "rel": "search",
            "type": "application/json",
            "href": "https://stacserver.org/search"
        }
    ],
    "conformsTo" : [
        "http://stacspec.org/spec/api/1.0.0-beta.1/req/stac-api-core",
        "http://stacspec.org/spec/api/1.0.0-beta.1/req/stac-search"
    ]
}
```

There are a few things to note: 

- The returned JSON is a valid [STAC Catalog](stac-spec/catalog-spec/catalog-spec.md), and it can provide any number of 'child' links
to navigate down to additional Catalogs, Collections & Items.
- The `links` section is a required part of STAC Catalog, and serves as the list of API endpoints. These can live at any location, the 
client must inspect the the `rel` to understand what capabilities are offered at each location.
- The `conformsTo` section follows exactly the structure of OGC API - Features [declaration of conformance 
classes](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_declaration_of_conformance_classes), except is available directly under 
the landing page. This is a slight break from how OGC API does things, as STAC feels it is important for clients to be able to understand
conformance in a single request. To be conformant to OGC API's the `/conformance` endpoint must be implemented as well.

This particular catalog provides the ability to browse down to STAC Collections through its `child` links, and also provides the search
endpoint to be able to search across its collections. Note though that none of those links are required, other servers may provide
different conformance classes and a different set of links. 

The only requirements of the STAC API core class are to provide a valid STAC Catalog that includes a valid `conformsTo` JSON object
in it. 

The root endpoint (`/`) is most useful when it presents a complete `Catalog` representation of all the data contained in the API, such 
that all `Collections` and `Items` can be navigated to by transitively traversing links from this root. This spec does not require any 
API endpoints from OAFeat or STAC API to be implemented, so the following links may not exist if the endpoint has not been implemented.

#### Link Relations at `/`

| **`rel`** | **href to**                                | **From**           | **Description**                                                  |
|-----------|--------------------------------------------|--------------------|------------------------------------------------------------------|
| `child`   | The child STAC Catalogs & Collections      | STAC Core          | Provides curated paths to get to STAC Collections and Items      |
| `data`    | OAFeat/OACommon `/collections` endpoint    | Commons Collection | The full list of Collections provided by the API                 |
| `search`  | The STAC search endpoint (often `/search`) | STAC Search        | Cross-collection query endpoint to select sub-sets of STAC Items |
| `service-desc` | The OpenAPI description of this service | OAFeat OpenAPI   | Uses the `application/vnd.oai.openapi+json;version=3.0` media type to refer to the OpenAPI 3.0 document that defines the service's API |
| `conformance` | OGC `/conformance` endpoint            | OAFeat / OACommon  | Only required for OGC API Compliant implementations              |

### STAC Search

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

#### Query Parameters and Fields

The following list of parameters is used to narrow search queries. They can all be represented as query string parameters 
in a GET request, or as JSON entity fields in a POST request. For filters that represent a set of values, query parameters 
should use comma-separated string values (with no outer brackets \[ or \]) and JSON entity attributes should use JSON Arrays. 

##### Query Examples

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

##### Query Parameter Table

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
should be returned. See [examples](examples.md) to see sample requests.

##### Reserved Parameters

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

#### GET & POST

A GET response from the search endpoint is **required**. POST is optional, but recommended.

#### Response

The response to a request (GET or POST) to the search endpoint should always be an `ItemCollection` - a valid [GeoJSON 
FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3) that consists entirely of STAC 
[Items](stac-spec/item-spec/item-spec.md). 

##### Paging

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

Example requests can be found in the [examples document](./examples.md#paging).

### OGC API - Common - Part 2: Collections

| **Name**             | **Conformance URI**                                           | **Dependencies** |
|----------------------|-------------------------------------------------------------------|------------------|
| OACommon Collections | <http://www.opengis.net/spec/ogcapi_common-2/1.0/req/collections> | None             |

[OGC API - Common - Part 2: Geospatial Data](http://docs.opengeospatial.org/DRAFTS/20-024.html) specifies a [Collections requirements 
class](http://docs.opengeospatial.org/DRAFTS/20-024.html#rc_collections-section) that describes how to request information on Collections
from an API. This provides the `data` rel type, that links to a list of collections that can all be referred to by ID. It is most often used
in conjunction with STAC Response, to return valid STAC Collections.

TODO: Consider making this just a STAC Collection thing, and align with OGC Common later, so we don't have depend on a draft, where 
we'd need to link to a particular commit to reference it.

### OGC API - Features

| **Name**                  | **Conformance URI**                                              | **Dependencies** | **Definition**                                                                                                      |   |
|---------------------------|------------------------------------------------------------------|------------------|---------------------------------------------------------------------------------------------------------------------|---|
| OAFeat Core               | <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core>    | None             | [Requirements Class Core](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#rc_core))                        |   |
| OpenAPI specification 3.0 | <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30>   | OAFeat Core      | [Requirements Class OpenAPI 3.0](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#rc_oas30))                |   |
| GeoJSON                   | <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson> | OAFeat Core      | [Requirements Class GeoJSON](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_requirements_class_geojson)) |   |

Adding OGC API - Features (OAFeat) to a STAC API means fully implementing all their requirements, and then returning STAC 
[Items](stac-spec/item-spec/README.md) from their `/items` endpoints. In OAFeat OpenAPI 3.0 and GeoJSON are optional 
conformance classes, enabling flexibility, but for STAC they are required, since STAC uses OpenAPI 3.0 and GeoJSON at its
core. 

The core OGC API - Features endpoints are shown below, with details provided in an 
[OpenAPI specification document](openapi/OAFeat.yaml).

| Endpoint                                        | Returns          | Description |
| ----------------------------------------------- | ---------------- | ----------- |
| `/`                                             | JSON             | Landing page, links to API capabilities |
| `/conformance`                                  | JSON             | Info about standards to which the API conforms |
| `/collections`                                  | JSON             | Object with a list of Collections contained in the catalog and links |
| `/collections/{collectionId}`                   | Collection       | Returns single Collection JSON |
| `/collections/{collectionId}/items`             | ItemCollection   | GeoJSON FeatureCollection-conformant entity of Items in collection |
| `/collections/{collectionId}/items/{featureId}` | Item             | Returns single Item (GeoJSON Feature) |
| `/api`                                          | OpenAPI 3.0 JSON | Returns an OpenAPI description of the service from the `service-desc` link `rel` - not required to be `/api`, but the document is required |

The OGC API - Features is a standard API that represents collections of geospatial data. It defines the RESTful interface 
to query geospatial data, with GeoJSON as a main return type. With OAFeat you can return any `Feature`, which is a geometry 
plus any number of properties. The core [STAC Item spec](stac-spec/item-spec/README.md) 
enhances the core `Feature` with additional requirements and options to enable cataloging of spatiotemporal 'assets' like 
satellite imagery. 

OAFeat also defines the concept of a Collection, which contains Features. In OAFeat Collections are the sets of data that can 
be queried ([7.11](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_collections_)), and each describes basic 
information about the geospatial dataset, like its name and description, as well as the spatial and temporal extents of all 
the data contained. [STAC collections](stac-spec/collection-spec/README.md) contain this same 
information, along with other STAC specific fields to provide additional metadata for searching spatiotemporal assets, and 
thus are compliant with both OAFeat Collections and STAC Collections and are returned from the `/collections/{collection_id}` 
endpoint.

In OAFeat, Features are the individual records within a Collection and are usually provided in GeoJSON format. 
[STAC Items](stac-spec/item-spec/README.md) are compliant with the OAFeat Features 
[GeoJSON requirements class](http://docs.ogc.org/is/17-069r3/17-069r3.html#_requirements_class_geojson), and are returned from the 
`/collections/{collection_id}/items/{item_id}` endpoint. The return of other encodings 
([html](http://docs.ogc.org/is/17-069r3/17-069r3.html#rc_html), [gml](http://docs.ogc.org/is/17-069r3/17-069r3.html#rc_gmlsf0))
is outside the scope of STAC API, as the [STAC Item](stac-spec/item-spec/item-spec.md) is
specified in GeoJSON.

A typical OAFeat will have multiple collections, and each will just offer simple search for its particular collection at 
`GET /collections/{collectionId}/items`. It is recommended to have each OAFeat Collection correspond to a STAC Collection,
and the `/collections/{collectionId}/items` endpoint can be used as a single collection search. Implementations may **optionally** 
provide support for the full superset of STAC API query parameters to the `/collections/{collectionId}/items` endpoint,
where the collection ID in the path is equivalent to providing that single value in the `collections` query parameter in 
STAC API.

Implementing OAFeat enables a wider range of clients to access the API's STAC Items, as it is a more widely implemented
protocol than STAC. 

#### Conformance

OAFeat, and OGC API in general, define their conformance at the `/conformance` endpoint. STAC does not require this endpoint,
defining the same `conformsTo` JSON structure at the root landing page. To be fully compliant with both specifications 
implementations should implement it in both places, so clients of both services can easily find it.

### Extensions

In the [extensions/](extensions/) folder there is additional functionality that can be layered onto a STAC API. Most all of 
them are compatible with OGC API - Features, and the plan is to fully align most of the functionality and have it be useful
for all OAFeat implementations. The conformance classes of the extensions are listed in the folder's [README](extensions/README.md)
and in each individual extension.

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
