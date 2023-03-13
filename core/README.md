# STAC API - Core Specification

- [STAC API - Core Specification](#stac-api---core-specification)
  - [Summary](#summary)
  - [Overview](#overview)
  - [Core](#core)
  - [Link Relations](#link-relations)
  - [Endpoints](#endpoints)
  - [Example Landing Page for STAC API - Core](#example-landing-page-for-stac-api---core)
  - [Extensions](#extensions)

## Summary

- **OpenAPI specification:** [openapi.yaml](openapi.yaml) ([rendered version](https://api.stacspec.org/v1.0.0-rc.2/core)),
- **Conformance URIs:**
  - <https://api.stacspec.org/v1.0.0-rc.2/core>
- **[Maturity Classification](../README.md#maturity-classification):** Candidate
- **Dependencies**: None
  and [commons.yaml](commons.yaml) is the OpenAPI version of the core [STAC spec](../stac-spec) JSON Schemas.

## Overview

All STAC API implementations must implement the *STAC API - Core* conformance class
<https://api.stacspec.org/v1.0.0-rc.2/core>. This requires a server to return from a root endpoint a valid
[STAC Catalog](../stac-spec/catalog-spec/catalog-spec.md) "landing page" that also includes a `conformsTo`
attribute with a string array value. Any API implementing this is considered a minimal, valid STAC API.

## Core

The root of a STAC API is the Landing Page, which is a STAC Catalog object with additional fields.
This resource is the starting point to determine what behaviors
the API supports via the `conformsTo` array and the URIs of resources via link relations.
Support for this type of behavior in a web API is known as
[Hypermedia as the Engine of Application State (HATEOAS)](https://en.wikipedia.org/wiki/HATEOAS).
A hypermedia-driven web API provides a robust, consistent, and flexible mechanism for interacting with remote resources.
STAC API relies heavily on hypermedia for API resource discovery and navigation.

In a STAC API, the root endpoint (Landing Page) has the following characteristics:

- The returned JSON is a [STAC Catalog](../stac-spec/catalog-spec/catalog-spec.md), and provides any number of 'child' links
  to navigate to additional [Catalog](../stac-spec/catalog-spec/catalog-spec.md),
  [Collection](../stac-spec/collection-spec/README.md), and [Item](../stac-spec/item-spec/README.md) objects.
- The `links` attribute is part of a STAC Catalog, and provides a list of relations to API endpoints. Some of these endpoints can
  exist on any path (e.g., sub-catalogs) and some have a specified path (e.g., `/search`),
  so the client must inspect the `rel` (relationship) to understand what capabilities are offered at each location.
- The `conformsTo` section provides the capabilities of this service. This is the field
  that indicates to clients that this is a STAC API and how to access conformance classes, including this
  one. The relevant conformance URIs are listed in each part of the API specification. If a conformance URI is listed then
  the service must implement all of the required capabilities.

Note the `conformsTo` array follows the same structure of the OGC API - Features [declaration of conformance
classes](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_declaration_of_conformance_classes), except it is part of the
landing page instead of in the JSON response from the `/conformance` endpoint. This is different from how the OGC API advertises
conformance, as STAC feels it is important for clients
to understand conformance from a single request to the landing page. Implementers who implement the *OGC API - Features* and/or
[STAC API - Features](../ogcapi-features/README.md) conformance classes must also implement the `/conformance` endpoint.

The scope of the conformance classes declared in the `conformsTo` field and the `/conformance` endpoint are limited
to the STAC API Catalog that declares them. A STAC API Catalog may link to sub-catalogs within it via `child` links
that declare different conformance classes. This is useful when an entire catalog cannot be searched against to
support the *STAC API - Item Search* conformance class, perhaps because it uses multiple databases to store items,
but sub-catalogs whose items are all in one database can support search.

## Link Relations

While the STAC definition of Link does not require the `type` field,
*STAC API - Core* requires all Links to have this field.
If the target of a Link's `type` is unknown, `type` SHOULD be set to `application/octet-stream` or `text/plain`.

The following Link relations must exist in the Landing Page (root).

| **rel**        | **href** | **Media Type**   | **From**        | **Description**                                      |
| -------------- | -------- | ---------------- | --------------- | ---------------------------------------------------- |
| `root`         | `/`      | application/json | STAC API - Core | The root URI                                         |
| `self`         | `/`      | application/json | OAFeat          | Self reference, same as root URI                     |
| `service-desc` | `/api`   | various          | OAFeat          | The service description in a machine-readable format |

The path for the `service-desc` endpoint is recommended to be `/api`, but may be another path. Recommended to be
OpenAPI 3.0 or 3.1 with media types `application/vnd.oai.openapi` (YAML),
`application/vnd.oai.openapi+json;version=3.0` (3.0 JSON), or `application/vnd.oai.openapi+json;version=3.1`
(3.1 JSON).

A `service-doc` endpoint is recommended, but not required. This commonly returns an HTML
page, for example, in the form of [Redoc](https://github.com/Redocly/redoc) interactive API
, but any format is allowed. The Link `type` field should correspond to whatever format or formats are
supported by this endpoint, e.g., `text/html`.

| **rel**       | **href**    | **Media Type** | **From** | **Description**                                                                                                                    |
| ------------- | ----------- | -------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `service-doc` | `/api.html` | text/html      | OAFeat   | A human-consumable service description. The path for this endpoint is only recommended to be `/api.html`, but may be another path. |

Additionally, `child` relations may exist to child Catalogs and Collections and `item` relations to Items. These
relations form a directed graph that enables traversal from a root catalog or collection to items.

| **rel** | **href** | **Media Type**       | **From**        | **Description**                        |
| ------- | -------- | -------------------- | --------------- | -------------------------------------- |
| `child` | various  | application/json     | STAC API - Core | The child STAC Catalogs & Collections. |
| `item`  | various  | application/geo+json | STAC API - Core | The child STAC Items.                  |

While it is valid to have `item` links from the landing page, most STAC API implementations
serve large numbers of features, so they will typically use several layers of intermediate `child` links to sub-catalogs and collections before
getting to Item objects.  These relations form a directed graph
of Catalogs and Collections, where interior nodes contain `child` relations, and the penultimate nodes will be
Catalogs with `item` relations to individual Items as leaf nodes.

`child` link relations may point to another STAC Catalog that *also* acts as a STAC API root, which can support
search over only a sub-catalog. This is useful for very large or federated catalogs that cannot support searching
over the entire catalog, but can support searching over individual sub-catalogs within it.

Note that there is a different link relation `items` (plural)
used by the [STAC API - Features](../ogcapi-features/README.md) conformance class that links from a collection resource
(at the `/collections/{collectionId}` endpoint) to the items in
that collection (at the `/collections/{collectionId}/items` endpoint). Both of these endpoints are
[derived from OGC API - Features](https://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_items_).

## Endpoints

This conformance class also requires for the endpoints in the [STAC API - Core](../core) conformance class to be implemented.

These endpoints are required, with details provided in this [OpenAPI specification document](openapi.yaml).

| **Endpoint** | **Media Type**   | **Returns**                                    | **Description**                                                                                                                                                    |
| ------------ | ---------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`          | application/json | [Catalog](../stac-spec/catalog-spec/README.md) | Landing page, links to API capabilities                                                                                                                            |
| `/api`       | various          | any                                            | The service description of the service from the `service-desc` link `rel`. The path is only recommended to be `/api`, and is at the discretion of the implementer. |

The service description endpoint may return any specification format. It is recommended to use OpenAPI 3.0 or 3.1
with media types `application/vnd.oai.openapi` (YAML), `application/vnd.oai.openapi+json;version=3.0` (3.0 JSON),
or `application/vnd.oai.openapi+json;version=3.1` (3.1 JSON). Whichever format or formats are used, the link
with relation `service-desc` must have a `type` field that matches an `Accept` header value to which the service
responds, and the `Content-Type` header in the response should contain the same media type. If the OpenAPI 3.0
format is used, the conformance class `http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30` should be
advertised. All service descriptions provided as part of the STAC API spec use OpenAPI 3.0 YAML format, and can
easily be used to return either YAML or JSON from this endpoint. OAFeat does not currently define a conformance
class for OpenAPI 3.1, but may in the future.

## Example Landing Page for STAC API - Core

This JSON is what would be expected from an API that only implements *STAC API - Core*. It is a valid STAC Catalog
with additional Links and a `conformsTo` attribute. In practice,
most APIs will also implement other conformance classes, and those will be reflected in the `links` and
`conformsTo` attribute.  A more typical Landing Page example is in
the [overview](../overview.md#example-landing-page) document.

This particular catalog provides both the ability to browse down to child Catalog objects through its
`child` links, and also provides the search endpoint to be able to search across items in its collections. Note
that some of those links are not required and other servers may provide
different conformance classes and a different set of links.

```json
{
    "stac_version": "1.0.0",
    "id": "example-stac",
    "title": "A simple STAC API Example",
    "description": "This Catalog aims to demonstrate a simple landing page",
    "type": "Catalog",
    "conformsTo" : [
        "https://api.stacspec.org/v1.0.0-rc.2/core"
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
            "type": "application/vnd.oai.openapi+json;version=3.0",
            "href": "https://stac-api.example.com/api"
        },
        {
            "rel": "service-doc",
            "type": "text/html",
            "href": "https://stac-api.example.com/api.html"
        },
        {
            "rel": "child",
            "type": "application/json",
            "href": "https://stac-api.example.com/catalogs/sentinel-2"
        },
        {
            "rel": "child",
            "type": "application/json",
            "href": "https://stac-api.example.com/catalogs/landsat-8"
        }
    ]
}
```

## Extensions

STAC API Extensions can be found at [stac-api-extensions.github.io](https://stac-api-extensions.github.io).
