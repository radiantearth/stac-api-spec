# STAC API - Collections

- [STAC API - Collections](#stac-api---collections)
  - [Link Relations](#link-relations)
  - [Endpoints](#endpoints)
  - [Pagination](#pagination)
  - [Example](#example)

- **OpenAPI specification:** [openapi.yaml](openapi.yaml) ([rendered version](https://api.stacspec.org/v1.0.0-beta.5/collections))
- **Conformance URI:** <http://stacspec.org/spec/api/1.0.0-beta.5/extensions/collections>
- **Extension [Maturity Classification](../extensions.md#extension-maturity):** Pilot
- **Dependencies**: [STAC API - Core](../core)

A STAC API can return information about all STAC [Collections](../stac-spec/collection-spec/collection-spec.md) available using a link
from the landing page that uses the `data` rel, which links to an endpoint called `/collections`. Individual STAC collections can be accessed
by providing the Collection `id` as a path past that endpoint: `/collections/{collectionId}`.

**NOTE**: *This conformance class is directly based on the [Features Collection](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_collections_)
section of OAFeat, which is in the process of becoming a 'building block in [OGC API - Common - Part 2: Geospatial 
Data](http://docs.opengeospatial.org/DRAFTS/20-024.html) as the [Collections requirements 
class](http://docs.opengeospatial.org/DRAFTS/20-024.html#rc_collections-section). Once the Common version is released we will 
aim to align with it. But it still seems to be in flux.*

## Link Relations

The following Link relations shall exist in the Landing Page (root).

| **rel**        | **href**       | **From**  | **Description**                                      |
| -------------- | -------------- | --------- | ---------------------------------------------------- |
| `root`         | `/`            | STAC Core | The root URI                                         |
| `self`         | `/`            | OAFeat    | Self reference, same as root URI                     |
| `service-desc` | `/api`         | OAFeat    | The service description in a machine-readable format |
| `data`         | `/collections` | OAFeat    | List of Collections                                  |

The path for the `service-desc` endpoint is recommended to be `/api`, but may be another path. Recommended to be
OpenAPI 3.0 or 3.1 with media types `application/vnd.oai.openapi` (YAML),
`application/vnd.oai.openapi+json;version=3.0` (3.0 JSON), or `application/vnd.oai.openapi+json;version=3.1`
(3.1 JSON).

A `service-doc` endpoint is recommended, but not required. This commonly returns an HTML
page, for example, in the form of [Redoc](https://github.com/Redocly/redoc) interactive API
documentation, but any format is allowed. The Link `type` field should correspond to whatever format or formats are
supported by this endpoint, e.g., `text/html`.

| **rel**       | **href**    | **From** | **Description**                                                                                                                    |
| ------------- | ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `service-doc` | `/api.html` | OAFeat   | A human-consumable service description. The path for this endpoint is only recommended to be `/api.html`, but may be another path. |

Additionally, `child` relations may exist to individual catalogs and collections.

| **rel** | **href** | **From**  | **Description**                                                                                          |
| ------- | -------- | --------- | -------------------------------------------------------------------------------------------------------- |
| `child` | various  | STAC Core | The child STAC Catalogs & Collections. Provides curated paths to get to STAC Collection and Item objects |

`child` relations are useful for supporting browsing a STAC API as if it were a static catalog.

The following Link relations shall exist in the `/collections` endpoint response.

| **rel** | **href**       | **From**  | **Description** |
| ------- | -------------- | --------- | --------------- |
| `root`  | `/`            | STAC Core | The root URI    |
| `self`  | `/collections` | OAFeat    | Self reference  |

The following Link relations shall exist in the Collection object returned from the `/collections/{collectionId}` endpoint.

| **rel**  | **href**                      | **From**  | **Description**                            |
| -------- | ----------------------------- | --------- | ------------------------------------------ |
| `root`   | `/`                           | STAC Core | The root URI                               |
| `parent` | `/`                           | OAFeat    | Parent reference, usually the root Catalog |
| `self`   | `/collections/{collectionId}` | OAFeat    | Self reference                             |

Additionally, these relations may exist for the `/collections/{collectionId}` endpoint:

| **rel**     | **href** | **From**  | **Description**                                                                                                                                                                                                                                                                                         |
| ----------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `canonical` | various  | STAC Core | Provides the preferred paths to get to STAC Collection and Item objects, if they differ from the URL that was used to retrieve the STAC object and thus duplicate other content. This can be useful in federated catalogs that present metadata that has a different location than the source metadata. |

Usually, the `self` link in a Collection must link to the same URL that was used to request
it. However, implementations may choose to have the canonical location of the Collection be
elsewhere. If this is done, it is recommended to include a `rel` of `canonical` to that location.

## Endpoints

| Endpoint                      | Returns    | Description                                                                                                    |
| ----------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| `/`                           | Catalog    | Landing Page and root Catalog                                                                                  |
| `/api`                        | any        | The service description. The path for this endpoint is only recommended to be `/api`, but may be another path. |
| `/collections`                | JSON       | Object with a list of Collections contained in the catalog and links                                           |
| `/collections/{collectionId}` | Collection | Returns single Collection JSON                                                                                 |

STAC API's implementing the Collections class must support HTTP GET operation at `/collections`, with the return JSON document consisting
of an array of all STAC Collections and an array of Links.

## Pagination

The `/collections` endpoint supports a pagination mechanism that aligns with pagination as described in the 
OGC API - Common - Part 2: Geospatial Data specification. This is described in detail in
the [STAC - Features Collection Pagination section](../ogcapi-features/README.md#collection-pagination).

## Example

Below is a minimal example, but captures the essence. Each collection object must be a valid STAC 
[Collection](../stac-spec/collection-spec/README.md), and each must have a `self` link that communicates its canonical location. And then 
the links section must include a `self` link, and it must also link to alternate representations (like html) of the collection.

```json
{
  "collections": [
    {
      "stac_version": "1.0.0",
      "stac_extensions": [ ],
      "id": "cool-data",
      "title": "Cool Data from X Satellite",
      "description": "A lot of awesome words describing the data",
      "type": "Collection",
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
          "href": "https://myservice.com"
        },
        {
          "rel": "parent",
          "type": "application/json",
          "href": "https://myservice.com"
        },
        {
          "rel": "self",
          "type": "application/json",
          "href": "https://myservice.com/collections/cool-data"
        },
        {
          "rel": "items",
          "type": "application/json",
          "href": "https://myservice.com/collections/cool-data/items"
        }
      ],
    }
  ],
  "links": [
    {
      "rel": "root",
      "type": "application/json",
      "href": "https://myservice.com"
    },
    {
      "rel": "self",
      "type": "application/json",
      "href": "https://myservice.com/collections"
    }
  ]
}
```
