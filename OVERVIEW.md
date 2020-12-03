## About

The STAC API defines a RESTful JSON-based server to browse and query [SpatioTemporal Asset Catalogs](stac-spec/) 
(STAC). While the core STAC specification provides a structure and language to describe assets, users usually want to access
a subset of the entire catalog, such as for a certain date range, in a particular area of interest, or matching properties
they care about. STAC API extensions specifies those query parameters, and compliant servers return collections of STAC Items that
match the user's preferences. A lot of additional functionality can added through the [OGC API](https://ogcapi.ogc.org/) family of
standards, particularly [OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html) (OAFeat, for our
shorthand). 
As STAC APIs follow a RESTful model, a core principal of this is the use of HTTP Request Methods ("verbs") and
the `Content-Type` header to drive behavior on resources ("nouns").

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
| STAC API Core             | STAC   | <http://stacspec.org/spec/api/1.0.0-beta.1/core>      | Specifies the STAC Landing page `/`, communicating conformance and available endpoints.          |
| STAC Search               | STAC   | <http://stacspec.org/spec/api/1.0.0-beta.1/req/stac-search>      | Enables search of all STAC Items on the server, with the STAC `[/search](#stac-api-endpoints)` endpoint.               |
| OACommon Collections       | OACommon | <http://www.opengis.net/spec/ogcapi_common-2/1.0/req/collections> | Provides listing of OGC API Collections ([reference](http://docs.opengeospatial.org/DRAFTS/20-024.html#rc_collections-section)) |
| STAC Response             | STAC | <http://stacspec.org/spec/api/1.0.0-beta.1/req/stac-response>    | Specifies that OAFeat's relevant responses conform to STAC: STAC Collections for OGC API Commons - [collections](http://docs.opengeospatial.org/DRAFTS/20-024.html#rc_collections-section) & STAC Items for OGC API's [Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_items_) Collections from the OAFeat `/collections` and `/collections/{collectionId}` endpoints.            |
| OAFeat Core               | OAFeat | <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core>    | The core OGC API - Features endpoints & parameters Returns one or more STAC Collections from the OAFeat `/collections` and `/collections/{collectionId}` endpoints. Depends on OAFeat Core.         ([reference](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#rc_core))                         |
| OpenAPI specification 3.0 | OAFeat | <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30>   | Describes the API as OpenAPI 3.0 ([reference](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#rc_oas30))                                          |
| GeoJSON                   | OAFeat | <http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson> | Requires OGC API - Features responses to be in GeoJSON ([reference](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_requirements_class_geojson)) |                                             |

Additional conformance classes are specified in the [STAC Extensions](extensions/README.md).

## HTTP Request Methods and Content Types

The STAC API, including its OAFeat components, follow a RESTful model. A core principal of this is the use of HTTP Request Methods ("verbs") and
the `Content-Type` header to drive behavior on resources ("nouns"). This section describes how these are used in the OAFeat and STAC endpoints. 

### GET

**Required**: OAFeat 1.0 only specifies GET query parameters, and they are all required. STAC's cross-collection `/search` also requires
GET queries for all implementations, and generally aligns with OAFeat's single Collection search. 

### POST

1. **Recommended** STAC `/search` is strongly recommended to implement POST `Content-Type: application/json`, where the content body is a JSON 
object representing a query and filter, as defined in [STAC Item Search](extensions/item-search). 
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
