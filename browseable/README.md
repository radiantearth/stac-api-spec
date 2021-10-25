# STAC API - Browseable 

- [STAC API - Browseable](#stac-api---browseable)
  - [Link Relations](#link-relations)
  - [Endpoints](#endpoints)
  - [Example](#example)

- **OpenAPI specification:** [openapi.yaml](openapi.yaml) ([rendered version](https://api.stacspec.org/v1.0.0-beta.5/browseable))
- **Conformance URI:** <https://api.stacspec.org/v1.0.0-beta.5/browseable>
- **Extension [Maturity Classification](../extensions.md#extension-maturity):** Pilot
- **Dependencies**: [STAC API - Core](../core)

The purpose of the `STAC API - Browseable` conformance class is to advertise that this web API supports iterative traversal to items in the catalog via `child` link relations (to catalogs and collections) and `item` link relations (to individual items). These link relations are defined in the STAC object specifications. This allows clients to browse down to items simply by following links.

Whenever a static STAC catalog is served over HTTP, it becomes a simple but mature (hypertext-driven) web API implementation. If the Catalog does not contain a `conformsTo` field, it is clear that it is a static catalog that can only be traversed through links. If `conformsTo` does exist, it is a (dynamic) STAC API, but it now unclear if it also works as a static catalog. The Browseable conformance class advertises explicitly that it 
can be navigated via `child` and `item` links. Browseable is important when the web API also conforms to 
dynamic catalog behaviors like STAC - Features or STAC - Item Search, so a client can discover definitively
that the Catalog can be accessed as either a static or dynamic catalog, without needing to use
out-of-band information or heuristics. 

Dynamic catalogs using conformance classes such as [STAC API - Item Search](../item-search/README.md) require implementation as a web service. A static catalog STAC API implementing Browseable could be implemented simply as a set of "static" files/objects on a web server or cloud data store accessible over HTTP. STAC API implementations may choose to present both this "static" Browseable interface and a "dynamic" Item Search interface, to accommodate a broader variety of clients and use cases.

A key limitation to a static catalog approach is that there is no mechanism for pagination. This means that hierarchy of catalogs, collections, and items must be structured such that each object is returned in a single request and no pagination is required. The [Catalogs](../catalogs/README.md) conformance class
can be useful for this, so that many sub-catalogs can be part of a hierarchy. This can be done statically or dynamically from a database.

While this API can be implemented using a set of static objects delivered via HTTP, it can also be implemented using a dynamic API. For example, for a gridded, periodic product like Landsat 8, an implementer may wish to create a browseable set of paths like `/{path_id}/{row_id}/{date}` that expose each path, row, and date as a sub-catalog. Likewise, a MODIS catalog could be exposed like `/{horizontal_grid}/{vertical_grid}/{date}/`.  

---

Redundant view of over the data. (1) follow the `data` link relation to the collections, then to each collection, then to (possibly paginated) items in each collection or (2) follow `child` link relations through the hierarchy of catalogs and collections to `item` link relations that point to individual items.


An implementer can choose to implement either or both of these. When implementing both, it is sometimes difficult to understand exactly how they interact. 

"static" hypermedia API
traverse the hierarchy of Catalog, Collection, and Item objects via link relations "child", "item", and "parent".

The Core and STAC - Features conformance classes provide an API: 
"data" link relation to list all Collections
"items" link relation to list all Items

Collections and Catalogs -- do they have to return all of them, even sub??


A STAC API can return information about all STAC [Collections](../stac-spec/collection-spec/collection-spec.md) available using a link
from the landing page that uses the link relation `data`, which links to an endpoint called `/collections`. Individual STAC collections can be accessed
by providing the Collection `id` as a path past that endpoint: `/collections/{collectionId}`.

## Link Relations

The following Link relations shall exist in the Landing Page (root).

| **rel**        | **href**       | **From**       | **Description**                                                                                                                                                                                                                                                |
| -------------- | -------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`         | `/`            | STAC Core      | The root URI                                                                                                                                                                                                                                                   |
| `self`         | `/`            | OAFeat         | Self reference, same as root URI                                                                                                                                                                                                                               |
| `service-desc` | `/api`         | OAFeat OpenAPI | The OpenAPI service description. Uses the `application/vnd.oai.openapi+json;version=3.0` media type to refer to the OpenAPI 3.0 document that defines the service's API. The path for this endpoint is only recommended to be `/api`, but may be another path. |

A `service-doc` endpoint is recommended, but not required.

| **rel**       | **href**    | **From**       | **Description**                                                                                                                                                                                                     |
| ------------- | ----------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `service-doc` | `/api.html` | OAFeat OpenAPI | An HTML service description.  Uses the `text/html` media type to refer to a human-consumable description of the service. The path for this endpoint is only recommended to be `/api.html`, but may be another path. |

Additionally, `child` relations should exist to individual catalogs and collections.

| **rel** | **href** | **From**  | **Description**                                                                                          |
| ------- | -------- | --------- | -------------------------------------------------------------------------------------------------------- |
| `child` | various  | STAC Core | The child STAC Catalogs & Collections. Provides curated paths to get to STAC Collection and Item objects |

`child` relations are useful for supporting browsing a STAC API as a static catalog.

## Endpoints

| Endpoint | Returns        | Description                                                                                                            |
| -------- | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `/`      | Catalog        | Landing Page and root Catalog                                                                                          |
| `/api`   | OAFeat OpenAPI | The OpenAPI service description. The path for this endpoint is only recommended to be `/api`, but may be another path. |

## Example



```json
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
          "rel": "self",
          "type": "application/json",
          "href": "https://myservice.com"
        },
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
          "rel": "child",
          "type": "application/json",
          "href": "https://myservice.com/catalogs/cool-data-catalog-1"
        },
        {
          "rel": "child",
          "type": "application/json",
          "href": "https://myservice.com/catalogs/cool-data-catalog-2"
        }
      ]
}
```
