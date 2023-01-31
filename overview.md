# About

The STAC API family of specifications define a JSON-based web API to browse and query [SpatioTemporal Asset Catalog](stac-spec/)
(STAC) objects. While the core STAC specification provides a structure and language to describe assets, users
usually want to access
a subset of the entire catalog, such as for a certain date range, in a particular area of interest, or
matching metadata properties. STAC API extensions specify those query parameters, and compliant servers return STAC [Item](stac-spec/item-spec/README.md)
objects that
match the user's query. Additional functionality can be added through the [OGC API](https://ogcapi.ogc.org/) family of
standards, particularly [OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html) (OAFeat, for our
shorthand).  Notes on implementation recommendations may be found [here](implementation.md).

## STAC API Description

### Core

The [Core](core/) of STAC API returns a valid [STAC Catalog](stac-spec/catalog-spec/catalog-spec.md) and a description
of STAC API specifications to which it conforms. The `links` section of the Catalog is the jumping-off
point for the more powerful capabilities - it contains a list of URLs with link
'relationships' (`rel`) and descriptions to indicate their functionality. Note that the [STAC Core specification](stac-spec) provides
most of the content of API responses - the STAC API is primarily concerned with the return of STAC
[Item](stac-spec/item-spec/README.md) and [Collection](stac-spec/collection-spec/README.md) objects via a
web API.  See the [rendered OpenAPI document](https://api.stacspec.org/v1.0.0-rc.2/core) for more details.

There are then two major sets of functionality that build on the core, [Item Search](item-search) and [Collection and Features](ogcapi-features)
, which are designed to be complementary, letting
implementations choose which parts they want to utilize.

### Item Search

The [Item Search](item-search) functionality is one of the most common, provided by the `search` rel
located at a `/search` endpoint. It re-uses all of the OAFeat [query
parameters](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_items_) specified in their 'core', and adds a
few more. It does not require a full implementation of OAFeat, but it is instead a simplified construct that can run a
search across any group of STAC [`Item`](stac-spec/item-spec/README.md) objects. See the [rendered OpenAPI
document](https://api.stacspec.org/v1.0.0-rc.2/item-search) for more details.

### Collections and Features

The other major functionality for a STAC API is to [serve STAC Collection and Item](ogcapi-features) objects through
the [OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html) endpoints. This enables any OAFeat client
to access STAC Item objects in the same way they do any other data. Every STAC Collection becomes available at the
`/collections` endpoint (making this a superset of the Collections functionality), with each
`/collections/{collectionId}/items` endpoint allowing search of the items
in that single collection. For STAC, this means implementing [OGC API - Features
Core](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_requirements_class_core), as well as
the OAFeat [GeoJSON](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_requirements_class_geojson),
since STAC objects are by definition also GeoJSON objects.
Full compliance involves splitting STAC `Item` objects into
individual `/collections/{collectionId}/items` endpoints that expose querying single collections, as OAFeat does
not currently support cross-collection search. It also adds a few other requirements, which are highlighted in the
[features description](ogcapi-features/), in order to help STAC implementors understand OAFeat without having to
read the full specification from scratch. See the [rendered OpenAPI document](https://api.stacspec.org/v1.0.0-rc.2/ogcapi-features)
for more details.

### Extensions & Fragments

Both STAC API and OAFeat allow 'extensions' that can be added for additional functionality. The STAC community has 
created [a number of extensions](https://stac-api-extensions.github.io) to OAFeat
in order to meet the requirements of its implementors. Additional details about extensions can be found in the
[extensions document](extensions.md).
These are specified in OpenAPI, which works cleanly when the new functionality is a new API location (a complete 
resource, or adding POST to an existing one). Many of the additions, however, are done at the parameter or response 
level, like adding a `sortby` field to return ordered results.

Each *extension* is made specifically against a part of the STAC API, so that it can be specified as a conformance
class (e.g., that Item Search is being extended to support `sortby` but not Features). 

We are working to fully align STAC's OAFeat extensions to be the same as the OGC API building blocks being worked on
so that every STAC extension is specified at the OGC API level. The end goal is for STAC API to just present a
curated set of extension options.

## STAC Core and OGC Versions

This version of STAC API depends on OGC API - Features - Part 1: Core [Version 1.0](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html).
Future versions will likely depend on [OGC API Common](https://github.com/opengeospatial/ogcapi-common) and additional parts of
Features as components evolve and mature.

This version of STAC API (1.x.x) is intended to work with any STAC core specification version 1.x.x (including betas), but is not
designed to work with STAC 2.0 and above (since we use [SemVer](https://semver.org/) it may introduce backwards incompatible changes).
The STAC API spec is released with the latest stable STAC core specification version included in the [`/stac-spec`](stac-spec/)
directory as a [submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules). To determine which version it is, just check the
[`/stac-spec/CHANGELOG.md`](stac-spec/CHANGELOG.md) for the topmost version & release date.

## Endpoints

STAC APIs follow the modern web API practices of using HTTP Request Methods ("verbs") and
the `Content-Type` header to drive behavior on resources ("nouns") in the endpoints listed below.

The following table describes the service resources available in a STAC API implementation that
supports all three of the foundation specifications. Note that the 'Endpoint'
column is more of an example in some cases. OGC API makes some endpoint locations required, those will be bolded below.

| Endpoint                                        | Specified in                                                  | Link Relationship | Returns                                                                                             | Description                                                                                                                                |
| ----------------------------------------------- | ------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                                             | [Core](core/)                                                 | root              | [Catalog](stac-spec/catalog-spec/catalog-spec.md)                                                   | Extends `/` from OAFeat to return a full STAC catalog.                                                                                     |
| `/search`                                       | [Item Search](item-search/)                                   | search            | [ItemCollection](fragments/itemcollection/README.md)                                                | Retrieves a group of Item objects matching the provided search predicates, probably containing search metadata from the `search` extension |
| `/collections`                                  | [Features](ogcapi-features/), [Collections](ogcapi-features/) | data              | JSON                                                                                                | Object with a list of Collection objects contained in the catalog and links                                                                |
| `/conformance`                                  | [Features](ogcapi-features/)                                  | conformance       | JSON                                                                                                | Info about standards to which the API conforms                                                                                             |
| `/api`                                          | [Features](ogcapi-features/)                                  | service-desc      | any                                                                                                 | The description of the endpoints in this service                                                                                           |
| `/collections/{collectionId}`                   | [Features](ogcapi-features/), [Collections](ogcapi-features/) | collection        | Collection                                                                                          | Returns single Collection JSON                                                                                                             |
| `/collections/{collectionId}/items`             | [Features](ogcapi-features/)                                  | items             | ItemCollection                                                                                      | GeoJSON FeatureCollection-conformant entity of Item objects in collection                                                                  |
| `/collections/{collectionId}/items/{featureId}` | [Features](ogcapi-features/)                                  | item              | Returns single Item (GeoJSON Feature). This relation is usually not used in OAFeat implementations. |

## Conformance Classes

STAC API is evolving to utilize OAFeat's
[Conformance](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_declaration_of_conformance_classes)
JSON structure. For
STAC API, we declare new STAC conformance classes, with the core ones detailed in the table below. [STAC
Features](ogcapi-features/) requires the core OAFeat conformance classes and declares that those endpoints return
STAC Collection and Feature objects.
The core STAC conformance classes communicate the conformance JSON only in the root (`/`) document, while OGC API
requires they also live at the `/conformance` endpoint. STAC's conformance structure is detailed in the
[core](core/). Note all
conformance URIs serve up a rendered HTML version of the corresponding OpenAPI document at the given location.

### Conformance Class Table

| **Name**               | **Specified in**                            | **Conformance URI**                                    | **Description**                                                                                                 |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| STAC API - Core        | [Core](core)                                | <https://api.stacspec.org/v1.0.0-rc.2/core>            | Specifies the STAC Landing page `/`, communicating conformance and available endpoints.                         |
| STAC API - Browseable  | [Core](core)                                | <https://api.stacspec.org/v1.0.0-rc.2/browseable>      | Advertises all Items can be reached through `child` and `item` links, as they would be in a non-API Catalog.    |
| STAC API - Item Search | [Item Search](item-search)                  | <https://api.stacspec.org/v1.0.0-rc.2/item-search>     | Enables search of all STAC Item objects on the server, with the STAC `[/search](#stac-api-endpoints)` endpoint. |
| STAC API - Features    | [Collections and Features](ogcapi-features) | <https://api.stacspec.org/v1.0.0-rc.2/ogcapi-features> | Specifies the use of OGC API - Features to serve STAC Item and Collection objects                               |
| STAC API - Collections | [Collections and Features](ogcapi-features) | <https://api.stacspec.org/v1.0.0-rc.2/collections>     | Specifies the use of a subset of STAC API - Features to serve Collection objects                                |

Additional conformance classes can be specified by [STAC API Extensions](extensions.md).

## Example Landing Page

When all three conformance classes (Core, Features, Item Search) are implemented, the relationships among
various resources are shown in the following diagram. In each node, there is also a `self` and `root` link
that are not depicted to keep the diagram more concise.

![Diagram of STAC link relations](stac-api.png)

The Landing Page will at least have the following `conformsTo` and `links`:

```json
{
    "stac_version": "1.0.0",
    "id": "example-stac",
    "title": "A simple STAC API Example",
    "description": "This Catalog aims to demonstrate the a simple landing page",
    "type": "Catalog",
    "conformsTo" : [
        "https://api.stacspec.org/v1.0.0-rc.2/core",
        "https://api.stacspec.org/v1.0.0-rc.2/browseable",
        "https://api.stacspec.org/v1.0.0-rc.2/collections",
        "https://api.stacspec.org/v1.0.0-rc.2/ogcapi-features",
        "https://api.stacspec.org/v1.0.0-rc.2/item-search",
        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30",
        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson"
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
            "rel": "conformance",
            "type": "application/json",
            "href": "https://stac-api.example.com/conformance"
        },
        {
            "rel": "service-desc",
            "type": "application/vnd.oai.openapi+json;version=3.0",
            "href": "https://stac-api.example.com/api"
        },
        {
            "rel": "service-doc",
            "type": "text/html",
            "href": "https://stac-api.example.com/api.html"
        },
        {
            "rel": "data",
            "type": "application/json",
            "href": "https://stac-api.example.com/collections"
        },
        {
            "rel": "child",
            "type": "application/json",
            "href": "https://stac-api.example.com/collections/sentinel-2",
        },
        {
            "rel": "child",
            "type": "application/json",
            "href": "https://stac-api.example.com/collections/landsat-8",
        },
        {
            "rel": "search",
            "type": "application/geo+json",
            "href": "https://stac-api.example.com/search"
        }
    ]
}
```
