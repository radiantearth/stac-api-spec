# STAC API - Children

- [STAC API - Children](#stac-api---children)
  - [Link Relations](#link-relations)
  - [Endpoints](#endpoints)
  - [Pagination](#pagination)
  - [Example](#example)

- **OpenAPI specification:** [openapi.yaml](openapi.yaml) ([rendered version](https://api.stacspec.org/v1.0.0-beta.5/children))
- **Conformance URIs:** 
  - <https://api.stacspec.org/v1.0.0-beta.5/children>
  - <https://api.stacspec.org/v1.0.0-beta.5/core>
- **[Maturity Classification](../README.md#maturity-classification):** Proposal
- **Dependencies**: [STAC API - Core](../core)

A STAC API Landing Page (a Catalog) can return information about the Catalog and Collection child objects
it contains using the link relation `children` to an endpoint `/children`. The purpose of this endpoint is
to present a single resource from which clients can retrieve
all the immediate child objects of a Catalog, which may be Catalog or Collection objects.
The `child` link relations in a Catalog already allow for describing these
relationships, but require a client to retrieve each resource URL to find any information about the children
(e.g., title, description), which can cause significant performance issues in user-facing applications.

It is recommended that the Catalog and Collection objects returned by the `/children` endpoint are the same
as those referenced by `child` link relations in the STAC API Landing Page. Following these semantics, it should
return the immediate children of the root Catalog, rather than all descendant catalogs or collections.

## Link Relations

This conformance class also requires implementation of the link relations in the [STAC API - Core](../core) conformance class.

The following Link relations shall exist in the Landing Page (root).

| **rel**    | **href**    | **From**        | **Description**                  |
| ---------- | ----------- | --------------- | -------------------------------- |
| `children` | `/children` | STAC API - Children | List of children of this catalog |

The following Link relations shall exist in the `/children` endpoint response.

| **rel** | **href**    | **From**            | **Description** |
| ------- | ----------- | ------------------- | --------------- |
| `root`  | `/`         | STAC Core           | The root URI    |
| `self`  | `/children` | STAC API - Children | Self reference  |

## Endpoints

This conformance class also requires for the endpoints in the [STAC API - Core](../core) conformance class to be implemented.

| Endpoint    | Returns        | Description                                                                                                            |
| ----------- | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `/children` | JSON           | Object with a list of child Catalogs and Collections                                                                   |

STAC APIs implementing the `STAC API - Children` conformance class must support HTTP GET operation at
`/children`, with the return JSON document consisting of an array of all child Catalogs and Collections in a field `children` and an 
array of Links in a field `links`.

## Pagination

The `/children` endpoint supports a pagination mechanism that aligns with pagination as described in the 
OGC API - Common - Part 2: Geospatial Data specification. This is described in detail in
the [STAC - Features Collection Pagination section](../ogcapi-features/README.md#collection-pagination).
To the greatest extent possible, the catalog should be structured such that all children can be
retrieved from the endpoint in a single call.

## Example

Below is a minimal example, but captures the essence. Each object in the `children` array 
must be a valid STAC [Collection](../stac-spec/collection-spec/README.md) or [Catalog](../stac-spec/catalog-spec/README.md),
and each must have a `self` link that communicates its canonical location. And then 
the links section must include a `self` link, and it must also link to alternate representations
(like html) of the collection.

The STAC API Landing Page should look like the following (note the `child` link relations):

```json
{
    "stac_version": "1.0.0",
    "id": "example-stac",
    "title": "A simple STAC API Example, implementing STAC API - Children",
    "description": "This Catalog aims to demonstrate the a simple landing page",
    "type": "Catalog",
    "conformsTo" : [
        "https://api.stacspec.org/v1.0.0-beta.5/core",
        "https://api.stacspec.org/v1.0.0-beta.5/children",
        "https://api.stacspec.org/v1.0.0-beta.5/browseable"
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
            "rel": "children",
            "type": "application/json",
            "href": "https://stacserver.org/children",
        },
        {
            "rel": "child",
            "type": "application/json",
            "href": "https://stacserver.org/catalogs/cool-data",
        },
        {
            "rel": "child",
            "type": "application/json",
            "href": "https://stacserver.org/catalogs/some-other-data",
        }
    ]
}
```

The `/children` endpoint response object should look as follows:

```json
{
  "children": [
    {
      "stac_version": "1.0.0",
      "stac_extensions": [ ],
      "id": "cool-data",
      "title": "Cool Data from X Satellite",
      "description": "A lot of awesome words describing the data",
      "type": "Catalog",
      "license": "CC-BY",
      "extent": {
        "spatial": {
          "bbox": [[-135.17, 36.83, -51.24, 62.25]]
        },
        "temporal": {
          "interval": [["2009-01-01T00:00:00Z",null]]
        }
      },
      "links": [
        {
          "rel": "root",
          "type": "application/json",
          "href": "https://stacserver.org"
        },
        {
          "rel": "parent",
          "type": "application/json",
          "href": "https://stacserver.org"
        },
        {
          "rel": "self",
          "type": "application/json",
          "href": "https://stacserver.org/catalogs/cool-data"
        }
      ],
    },
    {
      "stac_version": "1.0.0",
      "stac_extensions": [ ],
      "id": "some-other-data",
      "title": "Some Other Data from Y Satellite",
      "description": "More awesome words describing the data",
      "type": "Catalog",
      "license": "CC-BY",
      "extent": {
        "spatial": {
          "bbox": [[-135.17, 36.83, -51.24, 62.25]]
        },
        "temporal": {
          "interval": [["2009-01-01T00:00:00Z",null]]
        }
      },
      "links": [
        {
          "rel": "root",
          "type": "application/json",
          "href": "https://stacserver.org"
        },
        {
          "rel": "parent",
          "type": "application/json",
          "href": "https://stacserver.org"
        },
        {
          "rel": "self",
          "type": "application/json",
          "href": "https://stacserver.org/catalogs/some-other-data"
        }
      ],
    }
  ],
  "links": [
    {
      "rel": "root",
      "type": "application/json",
      "href": "https://stacserver.org"
    },
    {
      "rel": "self",
      "type": "application/json",
      "href": "https://stacserver.org/children"
    }
  ]
}
```
