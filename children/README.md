# STAC API - Children

- [STAC API - Children](#stac-api---children)
  - [Link Relations](#link-relations)
  - [Endpoints](#endpoints)
  - [Pagination](#pagination)
  - [Example](#example)

- **OpenAPI specification:** [openapi.yaml](openapi.yaml) ([rendered version](https://api.stacspec.org/v1.0.0-beta.5/children))
- **Conformance URI:** <https://api.stacspec.org/v1.0.0-beta.5/children>
- **Extension [Maturity Classification](../extensions.md#extension-maturity):** Pilot
- **Dependencies**: [STAC API - Core](../core)

A STAC API can return information about all STAC [Catalogs](../stac-spec/catalog-spec/catalog-spec.md) available using a link
from the landing page that uses the link relation `children`, which links to an endpoint called
`/children`. The purpose of this endpoint is to present a single resource from which clients can retrieve
all the child objects (Catalogs and Collections) of a Catalog. This eliminates then need for a client to
retrieve each `child` link from the root to retrieve additional information (e.g., title, description) about the child object.

## Link Relations

The following Link relations shall exist in the Landing Page (root).

| **rel**        | **href**    | **From**        | **Description**                                                                                                                                                                                                                                                |
| -------------- | ----------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`         | `/`         | STAC - Core     | The root URI                                                                                                                                                                                                                                                   |
| `self`         | `/`         | OAFeat          | Self reference, same as root URI                                                                                                                                                                                                                               |
| `service-desc` | `/api`      | OAFeat          | The OpenAPI service description. Uses the `application/vnd.oai.openapi+json;version=3.0` media type to refer to the OpenAPI 3.0 document that defines the service's API. The path for this endpoint is only recommended to be `/api`, but may be another path. |
| `children`     | `/children` | STAC - Children | List of children of this catalog                                                                                                                                                                                                                               |

A `service-doc` endpoint is recommended, but not required.

| **rel**       | **href**    | **From**       | **Description**                                                                                                                                                                                                     |
| ------------- | ----------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `service-doc` | `/api.html` | OAFeat OpenAPI | An HTML service description.  Uses the `text/html` media type to refer to a human-consumable description of the service. The path for this endpoint is only recommended to be `/api.html`, but may be another path. |

The following Link relations shall exist in the `/children` endpoint response.

| **rel** | **href**    | **From**  | **Description** |
| ------- | ----------- | --------- | --------------- |
| `root`  | `/`         | STAC Core | The root URI    |
| `self`  | `/children` | OAFeat    | Self reference  |

## Endpoints

| Endpoint    | Returns        | Description                                                                                                            |
| ----------- | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `/`         | Catalog        | Landing Page and root Catalog                                                                                          |
| `/api`      | OAFeat OpenAPI | The OpenAPI service description. The path for this endpoint is only recommended to be `/api`, but may be another path. |
| `/children` | JSON           | Object with a list of child Catalogs and Collections                                                                   |

STAC APIs implementing the STAC API - Children class must support HTTP GET operation at `/children`, with the return JSON document consisting
of an array of all child Catalogs and Collections and an array of Links.

## Pagination

The `/children` endpoint supports a pagination mechanism that aligns with pagination as described in the 
OGC API - Common - Part 2: Geospatial Data specification. This is described in detail in
the [STAC - Features Collection Pagination section](../ogcapi-features/README.md#collection-pagination).
To the greatest extent possible, the catalog should be structured such that all children can be
retrieved from the endpoint in a single call.

## Example

Below is a minimal example, but captures the essence. Each object must be a valid STAC 
[Collection](../stac-spec/collection-spec/README.md) or [Catalog](../stac-spec/catalog-spec/README.md),
and each must have a `self` link that communicates its canonical location. And then 
the links section must include a `self` link, and it must also link to alternate representations
(like html) of the collection.

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
          "href": "https://myservice.com/catalogs/cool-data"
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
          "href": "https://myservice.com/catalogs/some-other-data"
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
      "href": "https://myservice.com/children"
    }
  ]
}
```
