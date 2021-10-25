# STAC API - Browsable 

- [STAC API - Browsable](#stac-api---browsable)
  - [Link Relations](#link-relations)
  - [Endpoints](#endpoints)
  - [Example](#example)

- **OpenAPI specification:** [openapi.yaml](openapi.yaml) ([rendered version](https://api.stacspec.org/v1.0.0-beta.4/traversable))
- **Conformance URI:** <https://api.stacspec.org/v1.0.0-beta.4/traversable>
- **Extension [Maturity Classification](../extensions.md#extension-maturity):** Pilot
- **Dependencies**: [STAC API - Core](../core)

The purpose of the `STAC API - Browsable` conformance class is to advertise to clients that the API supports iterative traversal to all items in the catalog via `child` link relations (to sub-catalogs and collections) and `item` item link relations to individual items. While conformance classes such as [STAC API - Item Search](../item-search/README.md) require implementation in a web service (e.g., to run spatial queries against the data), a STAC API implementing Traversable could be implemented simply as a set of "static" objects in a cloud data store accessible over HTTP. STAC API implementations may choose to present both this "static" Traversable interface and a "dynamic" Item Search interface, to accommodate a broader variety of clients and use cases.

A key limitation to this approach is that there is no mechanism for pagination. This means that hierarchy of catalogs, collections, and items must be structured such that each object is returned in a single request and no pagination is required; in this case, of the `links` array.

***browse down to items simply by following links.***

Redunant view of over the data. (1) follow the `data` link relation to the collections, then to each collection, then to (possibly paginated) items in each collection or (2) follow `child` link relations through the hierarchy of catalogs and collections to `item` link relations that point to individual items.

different views over the data -- browse vs. search



A group of STAC objects properly connected via link relations presents a static, pseudo-API that a client can navigate to find data. 

A group of STAC objects exposed via a service conforming to STAC API provides dynamic spatial, temporal, and property query capabilities over the data. 

An implementer can choose to implement either or both of these. When implementing both, it is sometimes difficult to understand exactly how they interact. 

"static" hypermedia API
traverse the hierarchy of Catalog, Collection, and Item objects via link relations "child", "item", and "parent".

The Core and STAC - Features conformance classes provide an API: 
"data" link relation to list all Collections
"items" link relation to list all Items

Collections and Catalogs -- do they have to return all of them, even sub??

Each sub-catalog may in turn it's own STAC API root. 




A STAC API can return information about all STAC [Collections](../stac-spec/collection-spec/collection-spec.md) available using a link
from the landing page that uses the link relation `data`, which links to an endpoint called `/collections`. Individual STAC collections can be accessed
by providing the Collection `id` as a path past that endpoint: `/collections/{collectionId}`.

## Link Relations

The following Link relations shall exist in the Landing Page (root).

| **rel**        | **href**             | **From**       | **Description**                                                                                                                                                         |
| -------------- | -------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`         | `/`                  | STAC Core      | The root URI                                                                                                                                                            |
| `self`         | `/`                  | OAFeat         | Self reference, same as root URI                                                                                                                                        |
| `service-desc` | `/api` | OAFeat OpenAPI | The OpenAPI service description. Uses the `application/vnd.oai.openapi+json;version=3.0` media type to refer to the OpenAPI 3.0 document that defines the service's API. The path for this endpoint is only recommended to be `/api`, but may be another path. |
| `data`         | `/collections`       | OAFeat         | List of Collections   |

A `service-doc` endpoint is recommended, but not required.

| **rel**       | **href**                  | **From**       | **Description**  |
| ------------- | ------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `service-doc` | `/api.html` | OAFeat OpenAPI | An HTML service description.  Uses the `text/html` media type to refer to a human-consumable description of the service. The path for this endpoint is only recommended to be `/api.html`, but may be another path. |

Additionally, `child` relations may exist to individual catalogs and collections.

| **rel**        | **href**             | **From**       | **Description**                                                                                                                                                         |
| -------------- | -------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `child`        | various              | STAC Core      | The child STAC Catalogs & Collections. Provides curated paths to get to STAC Collection and Item objects |

`child` relations are useful for supporting browsing a STAC API as if it were a static catalog.

The following Link relations shall exist in the `/collections` endpoint response.

| **rel** | **href**       | **From**  | **Description** |
| ------- | -------------- | --------- | --------------- |
| `root`  | `/`            | STAC Core | The root URI    |
| `self`  | `/collections` | OAFeat    | Self reference  |

The following Link relations shall exist in the Collection object returned from the `/collections/{collectionId}` endpoint.

| **rel**  | **href**                            | **From**  | **Description**                            |
| -------- | ----------------------------------- | --------- | ------------------------------------------ |
| `root`   | `/`                                 | STAC Core | The root URI                               |
| `parent` | `/`                                 | OAFeat    | Parent reference, usually the root Catalog |
| `self`   | `/collections/{collectionId}`       | OAFeat    | Self reference                             |

Additionally, these relations may exist for the `/collections/{collectionId}` endpoint:

| **rel**  | **href**                            | **From**  | **Description**                            |
| -------- | ----------------------------------- | --------- | ------------------------------------------ |
| `canonical`        | various              | STAC Core      | Provides the preferred paths to get to STAC Collection and Item objects, if they differ from the URL that was used to retrieve the STAC object and thus duplicate other content. This can be useful in federated catalogs that present metadata that has a different location than the source metadata. |

Usually, the `self` link in a Collection must link to the same URL that was used to request
it. However, implementations may choose to have the canonical location of the Collection be
elsewhere. If this is done, it is recommended to include a `rel` of `canonical` to that location.

## Endpoints

| Endpoint | Returns | Description |
| -------- | ------- | ----------- |
| `/`                           | Catalog        | Landing Page and root Catalog |
| `/api`                        | OAFeat OpenAPI | The OpenAPI service description. The path for this endpoint is only recommended to be `/api`, but may be another path. |

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
