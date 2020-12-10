# About

The STAC API defines a RESTful JSON-based server to browse and query [SpatioTemporal Asset Catalogs](stac-spec/) 
(STAC). While the core STAC specification provides a structure and language to describe assets, users usually want to access
a subset of the entire catalog, such as for a certain date range, in a particular area of interest, or matching properties
they care about. STAC API extensions specifies those query parameters, and compliant servers return collections of STAC Items that
match the user's preferences. A lot of additional functionality can added through the [OGC API](https://ogcapi.ogc.org/) family of
standards, particularly [OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html) (OAFeat, for our
shorthand). 

## STAC API Description

The [core](core/) of STAC API simply returns a valid [STAC Catalog](stac-spec/catalog-spec/catalog-spec.md) and a description
of what parts of the fuller STAC API specification it conforms to. The `links` section of the Catalog is the jumping
off point for the more powerful capabilities - it contains a list of URL's, each described by particular link 
'relationships' (`rel`) to indicate their functionality. Note that the [STAC Core specification](stac-spec) provides 
most all the content of API responses - the STAC API is primarily concerned with the return of STAC 
[Items](stac-spec/item-spec/README.md) and [Collections](stac-spec/collection-spec/README.md) through API functionality.
See the [rendered OpenAPI document](https://api.stacspec.org/v1.0.0-beta.1/core) for more details.

There are then two major sets of functionality that build on the core, which are designed to be complementary, letting
implementations choose which parts they want to utilize. Most every STAC API implements at least one, and many follow
two or all three.	

### Item Search

The [item search](item-search) functionality is one of the most common, provided by the `search` rel often 
located at a `/search` endpoint. It re-uses all of the OAFeat [query 
parameters](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_items_) specified in their 'core', and adds a 
couple more. It does not require a full implementation of OAFeat, it is instead a simplified construct that can run a 
search across any set of indexed STAC [`Items`](stac-spec/item-spec/README.md). See the [rendered OpenAPI 
document](https://api.stacspec.org/v1.0.0-beta.1/item-spec) for more details.

### OGC API - Features

The other major functionality for a STAC API is to [serve STAC Collections and Items](ogcapi-features) through 
[OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html). This enables any OAFeat client
to access STAC Items in the same way they do any other data. Every STAC Collection becomes available at the
`collections/` endpoint, with each `collections/{collectionId}/items` endpoint allowing search of the items
in that single collection. For STAC this means implementing [OGC API - Features 
Core](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_requirements_class_core), as well as
following their [GeoJSON](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_requirements_class_geojson) and 
[OpenAPI](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_requirements_class_openapi_3_0) options, since STAC 
is always in GeoJSON and OpenAPI is used to specify STAC API. Full compliance involves splitting STAC `Items` into
individual `/collections/{collectionId}/items` endpoints that expose querying single collections, as OAFeat does
not currently allow cross-collection search. And it adds a few other requirements, which are highlighted in the 
[features description](ogcapi-features/), in order to help STAC implementors understand OAFeat without having to
read the full spec from scratch. See the [rendered OpenAPI document](https://api.stacspec.org/v1.0.0-beta.1/ogcapi-features)
for more details.

### Extensions & Fragments

Both STAC API and OAFeat allow 'extensions' that can be added for additional functionality. The STAC community has 
created a number of extensions to OAFeat, in order to meet requirements of its implementors, and the complete list 
can be found in the [extensions document](extensions.md), which links to each of them and details their maturity . 
These are specified in OpenAPI, which works cleanly when the new functionality is a new api location (a complete 
resource, or adding POST to an existing one). Many of the additions, however, are done at the parameter or response 
level, like adding a `sortby` field to return ordered results. To make these reusable by both Item Search and OAFeat, 
in STAC they are specified in the [fragments/](fragments/) directory, where the core functionality is described.
Each *extension* is made specifically against a part of the STAC API, so that it can be specified as a conformance
class (to say, for example, that item-search supports `sortby` but ogcapi-features does not). But if it is based
on a fragment then it will likely just be a thin wrapper to declare the conformance. This is a bit less than ideal,
but it seemed to be the best approach that actually works with OpenAPI.

We are working to fully align STAC's OAFeat extensions to be the same as the OGC API building blocks being worked on,
so that every STAC extension is specified at the OGC API level. The end goal is for STAC API to just present a 
curated set of extension options.

## STAC Core and OGC Versions

This version of STAC API depends on OGC API - Features - Part 1: Core [Version 1.0](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html).
Future versions will likely depend on [OGC API Common](https://github.com/opengeospatial/ogcapi-common) and additional parts of
Features as components evolve and mature.

This version of STAC API is intended to work with any STAC core specification version 0.9.x or 1.x.x (included betas), but is not 
designed to work with STAC 2.0 and above (since we use [SemVer](https://semver.org/) it may introduce backwards incompatible changes). 
The STAC API spec is released with the latest stable STAC core specification version included in the [`/stac-spec`](stac-spec/) 
directory as a [submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules). To determine which version it is just check the 
[`/stac-spec/CHANGELOG.md`](stac-spec/CHANGELOG.md) for the topmost version & release date.

## Capabilities List

As STAC APIs follow a RESTful model, a core principal of this is the use of HTTP Request Methods ("verbs") and
the `Content-Type` header to drive behavior on resources ("nouns") - the endpoints listed below.

The following table describes the service resources available in a full STAC API implementation. Note that the 'Endpoint'
column is more of an example in some cases. OGC API makes some endpoint locations required, those will be bolded below.

| Endpoint                                            | Specified in               | Link Relationship | Returns                                           | Description                                                                                                                         |
|-----------------------------------------------------|----------------------------|-------------------|---------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `/`                                                 | [Core](core)               | root              | [Catalog](stac-spec/catalog-spec/catalog-spec.md) | Extends `/` from OAFeat to return a full STAC catalog.                                                                              |
| `/search`                                           | [Item Search](item-search) | search            | [ItemCollection](fragments/itemcollection/README.md)                                    | Retrieves a group of Items matching the provided search predicates, probably containing search metadata from the `search` extension |
| **`/collections`**                                  | [OAFeat](ogcapi-features)  | data              | JSON                                              | Object with a list of Collections contained in the catalog and links                                                                |
| **`/conformance`**                                  | [OAFeat](ogcapi-features)  | conformance       | JSON                                              | Info about standards to which the API conforms                                                                                      |
| `/api`                                              | [OAFeat](ogcapi-features)  | service-desc      | OpenAPI 3.0 JSON                                  | The OpenAPI definition of the endpoints in this service                                                                             |
| **`/collections/{collectionId}`**                   | [OAFeat](ogcapi-features)  | collection        | Collection                                        | Returns single Collection JSON                                                                                                      |
| **`/collections/{collectionId}/items`**             | [OAFeat](ogcapi-features)  | items             | ItemCollection                                    | GeoJSON FeatureCollection-conformant entity of Items in collection                                                                  |
| **`/collections/{collectionId}/items/{featureId}`** | [OAFeat](ogcapi-features)  | Item              | Returns single Item (GeoJSON Feature)             |                                                                                                                                     |

## Conformance Classes

STAC API is evolving to utilize OAFeat's 
'[Conformance](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_declaration_of_conformance_classes)' JSON structure. For 
STAC API 1.0.0-beta.1 we declare new STAC Conformance classes, with the core ones detailed in the table below. [STAC 
Features](ogcapi-features) requires the core OAFeat conformance classes, and declares that those endpoints return STAC Collections
and Features. The core STAC conformance classes communicate the conformance JSON only in the root (`/`) document, while OGC API 
requires they also live at the `/conformance` endpoint. STAC's conformance structure is detailed in the [core](core/). Note all 
conformance URI's serve up a rendered HTML version of the corresponding OpenAPI document at the given location.

**NOTE:** *By 1.0.0 we aim to have requirements classes specified in detail, as testable assertions, 
like OGC does, but for now the core reference is just this spec document and the OpenAPI yaml. We also desire to have the
URI's for conformance to actually resolve to machine-readable information clients can use.*	

### Conformance Class Table

| **Name**                  | **Specified in**           | **Conformance URI**                                              | **Description**                                                                                                                                                                                                                                                                     |
|---------------------------|----------------------------|------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| STAC Core                 | [Core](core)               | <https://api.stacspec.org/v1.0.0-beta.1/core>          | Specifies the STAC Landing page `/`, communicating conformance and available endpoints.                                                                                                                                                                                             |
| Item Search               | [Item Search](item-search) | <https://api.stacspec.org/v1.0.0-beta.1/item-search>          | Enables search of all STAC Items on the server, with the STAC `[/search](#stac-api-endpoints)` endpoint.                                                                                                                                                                            |
| STAC Features             | [STAC API - Features](ogcapi-features)  | <https://api.stacspec.org/v1.0.0-beta.1/ogcapi-features>      | Specifies the use of OGC API - Features to serve STAC Items and Collections                                                                                                                                                                                                         |

Additional conformance classes are specified in the [STAC Extensions](extensions.md#Conformance-classes-of-extensions).
