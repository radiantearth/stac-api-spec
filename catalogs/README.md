# STAC API - Catalogs 

- [STAC API - Catalogs](#stac-api---catalogs)
  - [Link Relations](#link-relations)
  - [Endpoints](#endpoints)
  - [Pagination](#pagination)
  - [Example](#example)

- **OpenAPI specification:** [openapi.yaml](openapi.yaml) ([rendered version](https://api.stacspec.org/v1.0.0-beta.5/catalogs))
- **Conformance URI:** <https://api.stacspec.org/v1.0.0-beta.5/catalogs>
- **Extension [Maturity Classification](../extensions.md#extension-maturity):** Pilot
- **Dependencies**: [STAC API - Core](../core)

A STAC API can return information about STAC [Catalogs](../stac-spec/catalog-spec/catalog-spec.md) available within
a parent catalog (i.e., sub-catalogs). This can be accessed from the landing page via a Link
with the `catalogs` link relation, which links to an endpoint called `/catalogs`. 
The Catalogs resource endpoint (`/catalogs/{catalogId}`) provides access to the root catalog and sub-catalogs. 
Catalogs may also link to other child catalogs using the `child` link relation.  Each sub-catalog may in turn be its own STAC API root over only that sub-catalog.

There are two main purposes of the Catalogs conformance class:

2. provide an endpoint (`/catalogs`) that can provide a curated view of descendant catalogs in a parent catalog
1. provide an endpoint (`/catalogs/{catalog_id}`) for exposing child catalogs in a parent catalog

Also gather together related collections. For example, a catalog may contain several collections of MODIS data products (e.g., MOD11A1, MYD11A1, MCD43A4), and a sub-catalog (e.g., MODIS) could gather these together. that catalog can be its own STAC API root. hierarchy of 

CMR STAC and Planetary Computer.

/catalogs/modis/search

/search?collections=mcd43a4,mod11a1,myd11a1


https://cmr.earthdata.nasa.gov/stac/
- only conform to Core and Catalogs

child Catalogs conform to Item Search


## Link Relations

The following Link relations shall exist in the Landing Page (root).

| **rel**        | **href**    | **From**       | **Description**                                                                                                                                                                                                                                                |
| -------------- | ----------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`         | `/`         | STAC Core      | The root URI                                                                                                                                                                                                                                                   |
| `self`         | `/`         | OAFeat         | Self reference, same as root URI                                                                                                                                                                                                                               |
| `service-desc` | `/api`      | OAFeat OpenAPI | The OpenAPI service description. Uses the `application/vnd.oai.openapi+json;version=3.0` media type to refer to the OpenAPI 3.0 document that defines the service's API. The path for this endpoint is only recommended to be `/api`, but may be another path. |
| `catalogs`     | `/catalogs` | STAC Catalogs  | List of Catalogs                                                                                                                                                                                                                                               |

A `service-doc` endpoint is recommended, but not required.

| **rel**       | **href**    | **From**       | **Description**                                                                                                                                                                                                     |
| ------------- | ----------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `parent` | varies                     | OAFeat        | Parent reference, unless this Catalog is the ultimate root and has no parent catalog |
| `service-doc` | `/api.html` | OAFeat OpenAPI | An HTML service description.  Uses the `text/html` media type to refer to a human-consumable description of the service. The path for this endpoint is only recommended to be `/api.html`, but may be another path. |

The following Link relations shall exist in the `/catalogs` endpoint response.

| **rel** | **href**    | **From**      | **Description** |
| ------- | ----------- | ------------- | --------------- |
| `root`  | `/`         | STAC Core     | The root URI    |
| `self`  | `/catalogs` | STAC Catalogs | Self reference  |

The following Link relations shall exist in the Catalog object returned from the `/catalogs/{catalogId}` endpoint.

| **rel**  | **href**                | **From**      | **Description**                            |
| -------- | ----------------------- | ------------- | ------------------------------------------ |
| `root`   | `/`                     | STAC Core     | The root URI                               |
| `parent` | `/`                     | OAFeat        | Parent reference, usually the root Catalog |
| `self`   | `/catalogs/{catalogId}` | STAC Catalogs | Self reference                             |

Additionally, these relations may exist for the `/catalogs/{catalogId}` endpoint:

| **rel**     | **href** | **From**  | **Description**                                                                                                                                                                                                                                                                             |
| ----------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `canonical` | various  | STAC Core | Provides the preferred paths to get to STAC Catalog objects, if they differ from the URL that was used to retrieve the STAC object and thus duplicate other content. This can be useful in federated catalogs that present metadata that has a different location than the source metadata. |

Usually, the `self` link in a Catalog must link to the same URL that was used to request
it. However, implementations may choose to have the canonical location of the Collection be
elsewhere. If this is done, it is recommended to include a `rel` of `canonical` to that location.

## Endpoints

| Endpoint                | Returns        | Description                                                                                                            |
| ----------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `/`                     | Catalog        | Landing Page and root Catalog                                                                                          |
| `/api`                  | OAFeat OpenAPI | The OpenAPI service description. The path for this endpoint is only recommended to be `/api`, but may be another path. |
| `/catalogs`             | JSON           | Object with a list of all sub-catalogs contained in this catalog and links                                             |
| `/catalogs/{catalogId}` | Catalog        | Returns single Catalog JSON                                                                                            |

STAC APIs implementing the Catalogs class must support HTTP GET operation at `/catalogs`, with the return JSON document consisting
of an array of STAC Catalog object and an array of Links. 

The `/catalogs` endpoint is not required to return all catalogs, which may be impractical or not useful for deep hierarchies. One use of this endpoint may be to drive UI behavior where only "top-level" catalogs are presented on an overview page to the user.

tree of catalogs and collections may be

root
- /collections/landsat8 collection
- /catalogs/landsat8 catalog
- /catalogs/landsat8/{row} catalogs
- /catalogs/landsat8/{row}_{path} catalogs
- /catalogs/landsat8/{row}_{path}_{year} catalogs
- /collections/landsat8/items/{item_id} 

## Pagination

The `/catalogs` endpoint supports a pagination mechanism that aligns with pagination as described in the OGC API - Common - Part 2: Geospatial Data specification. This is described in detail in the [STAC - Features Collection Pagination section](../ogcapi-features/README.md#collection-pagination). With this, Links with 
relations `next` and `prev` are included in the `links` array,
and these are used to navigate to the next and previous pages of Catalog objects. The specific query
parameter used for paging is implementation specific and not defined by STAC API. For example, 
an implementation may take a parameter (e.g., `page`) indicating the numeric page of results, a
base64-encoded value indicating the last result returned for the current page (e.g., `search_after` as
in Elasticsearch), or a cursor token representing backend state.  

In our simple example of numerical pages, the response for `page=3` would have a
`links` array containing these two Links indicating the URLs for the next (page=4) and 
previous (page=2) pages:

```none
"links": [
  ...
  {
    "rel": "prev",
    "href": "http://api.cool-sat.com/catalogs?page=2"
  },
  {
    "rel": "next",
    "href": "http://api.cool-sat.com/catalogs?page=4"
  }
]
```

Additionally, STAC has extended the Link object to support additional fields that provide header values
to the client should they be needed for a subsequent request for the next page of results. The use
of header values for pagination with GET requests is uncommon, so if your implementation does not use them you can omit this attribute in the Link. These
fields are described in detail in the [Item Search](../item-search/README.md#paging) spec. 

## Example

Below is an example. Each Catalog object must be a valid STAC 
[Catalog](../stac-spec/catalog-spec/README.md), and each must have a `self` link that communicates its canonical location. And then 
the links section must include a `self` link, and it must also link to alternate representations (like html) of the collection.

```json
{
  "catalogs": [
    {
      "id": "root",
      "title": "Root Catalog",
      "description": "Root catalog",
      "type": "Catalog",
      "stac_version": "1.0.0",
      "links": [
        {
          "rel": "self",
          "href": "http://api.cool-sat.com",
          "title": "Self",
          "type": "application/json"
        },
        {
          "rel": "root",
          "href": "http://api.cool-sat.com",
          "title": "Root catalog",
          "type": "application/json"
        },
        {
          "rel": "data",
          "href": "http://api.cool-sat.com/collections",
          "title": "Provider Collections",
          "type": "application/json"
        },
        {
          "rel": "search",
          "href": "http://api.cool-sat.com/search",
          "title": "Provider Item Search",
          "type": "application/geo+json",
          "method": "GET"
        },
        {
          "rel": "conformance",
          "href": "http://api.cool-sat.com/conformance",
          "title": "Conformance Classes",
          "type": "application/geo+json"
        },
        {
          "rel": "service-desc",
          "href": "http://api.cool-sat.com/api",
          "title": "OpenAPI Doc",
          "type": "application/vnd.oai.openapi;version=3.0"
        },
        {
          "rel": "service-doc",
          "href": "http://api.cool-sat.com/api.html",
          "title": "HTML documentation",
          "type": "text/html"
        },
        {
          "rel": "child",
          "href": "http://api.cool-sat.com/catalogs/modis",
          "type": "application/json"
        },
        {
          "rel": "child",
          "href": "http://api.cool-sat.com/catalogs/landsat8",
          "type": "application/json"
        },
        {
          "rel": "next",
          "href": "http://api.cool-sat.com/catalogs?page=2"
        }
      ],
      "conformsTo": [
        "https://api.stacspec.org/v1.0.0-beta.5/core",
        "https://api.stacspec.org/v1.0.0-beta.5/catalogs",
        "https://api.stacspec.org/v1.0.0-beta.5/ogcapi-features",
        "https://api.stacspec.org/v1.0.0-beta.5/item-search",
        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30",
        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson"
      ]
    }
  ]
}
```
