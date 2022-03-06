# STAC API - Core Specification

- [STAC API - Core Specification](#stac-api---core-specification)
  - [Link Relations](#link-relations)
  - [Endpoints](#endpoints)
  - [Example Landing Page for STAC API - Core](#example-landing-page-for-stac-api---core)
  - [Extensions](#extensions)
  - [Structuring Catalog Hierarchies](#structuring-catalog-hierarchies)

- **OpenAPI specification:** [openapi.yaml](openapi.yaml) ([rendered version](https://api.stacspec.org/v1.0.0-beta.5/core)),
- **Conformance URIs:**
  - <https://api.stacspec.org/v1.0.0-beta.5/core>
- **[Maturity Classification](../README.md#maturity-classification):** Pilot
- **Dependencies**: None
  and [commons.yaml](commons.yaml) is the OpenAPI version of the core [STAC spec](../stac-spec) JSON Schemas.

All STAC API implementations must support the *STAC API - Core* conformance class. The only requirement of this class
is to provide a valid [STAC Catalog](../stac-spec/catalog-spec/catalog-spec.md) that also includes a `conformsTo`
attribute with a string array value. Any API implementing this is considered a valid STAC API.

Even if a STAC catalog is simply files on a web server or objects in cloud storage, serving these files over HTTP
makes it into a defacto hypermedia-driven web API. Even if none of the 
STAC API conformance classes are implemented, the catalog can be traversed from the root via `child` and `item` link relations (though it is not
required that all Items are reachable). Support for 
this "browse" mode of interaction is complementary to the dynamic search capabilities defined in the
*STAC API - Features* and *STAC API - Item Search* conformance classes.
Conversely, STAC API implementations may not support browse, even though the root is a Catalog object, if they do not
have the appropriate `child` and `item` link relations to traverse over the objects in the catalog. STAC API
implementations may provide an even greater guarantee of Item reachability with the
[STAC API - Browseable](../browseable/README.md) conformance class.

Providing these two complementary ways of interacting with the catalog allow users to iteratively interrogate the data
to discover what data is available through browse and filter the data to only what they are interested in
through search.  Supporting both also opens up a catalog to
clients that are oriented towards reading non-API STAC catalogs
(e.g., [STAC Browser](https://github.com/radiantearth/stac-browser)) and those that are oriented towards
searchable STAC API catalogs
(e.g., [PySTAC Client](https://pystac-client.readthedocs.io/), [stac-nb](https://github.com/darrenwiens/stac-nb)).
Recommendations for supporting both of these discussed in [Structuring Catalog Hierarchies](#structuring-catalog-hierarchies).

The root of a STAC API is the Landing Page. This resource is the starting point to determine what behaviors 
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
  so the client must inspect the the `rel` (relationship) to understand what capabilities are offered at each location.
- The `conformsTo` section provides the capabilities of this service. This is the field
  that indicates to clients that this is a STAC API and how to access conformance classes, including this
  one. The relevant conformance URIs are listed in each part of the API specification. If a conformance URI is listed then 
  the service must implement all of the required capabilities.

Note the `conformsTo` array follows the same structure of the OGC API - Features [declaration of conformance 
classes](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_declaration_of_conformance_classes), except it is part of the
landing page instead of in the JSON response from the `/conformance` endpoint. This is different from how the OGC API advertises 
conformance, as STAC feels it is important for clients
to understand conformance from a single request to the landing page. Implementers who implement the *OGC API - Features* and/or 
*STAC API - Features* conformance classes must also implement the `/conformance` endpoint.

The scope of the conformance classes declared in the `conformsTo` field and the `/conformance` endpoint are limited
to the STAC API Catalog that declares them. A STAC API Catalog may link to sub-catalogs within it via `child` links
that declare different conformance classes. This is useful when an entire catalog cannot be searched against to
support the *STAC API - Item Search* conformance class, perhaps because it uses multiple databases to store items,
but sub-catalogs whose items are all in one database can support search. 

## Link Relations

The following Link relations must exist in the Landing Page (root).

| **rel**        | **href** | **From**  | **Description**                                      |
| -------------- | -------- | --------- | ---------------------------------------------------- |
| `root`         | `/`      | STAC Core | The root URI                                         |
| `self`         | `/`      | OAFeat    | Self reference, same as root URI                     |
| `service-desc` | `/api`   | OAFeat    | The service description in a machine-readable format |

The path for the `service-desc` endpoint is recommended to be `/api`, but may be another path. Recommended to be
OpenAPI 3.0 or 3.1 with media types `application/vnd.oai.openapi` (YAML),
`application/vnd.oai.openapi+json;version=3.0` (3.0 JSON), or `application/vnd.oai.openapi+json;version=3.1`
(3.1 JSON).

A `service-doc` endpoint is recommended, but not required. This commonly returns an HTML
page, for example, in the form of [Redoc](https://github.com/Redocly/redoc) interactive API
, but any format is allowed. The Link `type` field should correspond to whatever format or formats are
supported by this endpoint, e.g., `text/html`.

| **rel**       | **href**    | **From** | **Description**                                                                                                                    |
| ------------- | ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `service-doc` | `/api.html` | OAFeat   | A human-consumable service description. The path for this endpoint is only recommended to be `/api.html`, but may be another path. |

Additionally, `child` relations may exist to child Catalogs and Collections and `item` relations to Items. These
relations form a directed graph that enables traversal from a root catalog or collection to items.

| **rel** | **href** | **From**  | **Description**                        |
| ------- | -------- | --------- | -------------------------------------- |
| `child` | various  | STAC Core | The child STAC Catalogs & Collections. |
| `item`  | various  | STAC Core | The child STAC Items.                  |

While it is valid to have `item` links from the landing page, most STAC API implementations 
serve large numbers of features, so they will typically use several layers of intermediate `child` links before
getting to Item objects.  These relations form a directed graph
of Catalogs and Collections, where interior nodes contain `child` relations, and the penultimate nodes will be
Catalogs with `item` relations to individual Items as leaf nodes. 

`child` link relations may point to another STAC Catalog that *also* acts as a STAC API root, which can support
search over only a sub-catalog. This is useful for very large or federated catalogs that cannot support searching
over the entire catalog, but can support searching over individual sub-catalogs within it.

Note that there is a different link relation `items` (plural)
used by the *STAC API - Features* conformance class that links from a collection resource
(at the `/collections/{collectionId}` endpoint) to the items in
that collection (at the `/collections/{collectionId}/items` endpoint). Both of these endpoints are 
[derived from OGC API - Features](https://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_items_).

## Endpoints

This conformance class also requires for the endpoints in the [STAC API - Core](../core) conformance class to be implemented.

These endpoints are required, with details provided in this [OpenAPI specification document](openapi.yaml).

| Endpoint | Returns                                        | Description                                                                                                                                                        |
| -------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`      | [Catalog](../stac-spec/catalog-spec/README.md) | Landing page, links to API capabilities                                                                                                                            |
| `/api`   | any                                            | The service description of the service from the `service-desc` link `rel`. The path is only recommended to be `/api`, and is at the discretion of the implementer. |

The service description endpoint may return any specification format. It is recommended to use OpenAPI 3.0 or 3.1
with media types `application/vnd.oai.openapi` (YAML), `application/vnd.oai.openapi+json;version=3.0` (3.0 JSON),
or `application/vnd.oai.openapi+json;version=3.1` (3.1 JSON). Whichever format or formats are used, the link
with relation `service-desc` must have a `type` field that matches an `Accept` header value to which the service
responds, and the `Content-Type` header in the response should contain the same media type. If the OpenAPI 3.0
format is used, the conformance class `http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30` should be
advertised. All service descriptions provided as part of the STAC API spec use OpenAPI 3.0 YAML format, and can
easily be used to return either YAML or JSON from this endpoint. OAFeat does not currently define a conformance
class for OpenAPI 3.1, but may in the future. 

If sub-catalogs are used, it is **recommended** that these use the endpoint `/catalogs/{catalogId}` to avoid conflicting
with other endpoints from the root.

| Endpoint                | Returns                                        | Description          |
| ----------------------- | ---------------------------------------------- | -------------------- |
| `/catalogs/{catalogId}` | [Catalog](../stac-spec/catalog-spec/README.md) | child Catalog object |

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
    "description": "This Catalog aims to demonstrate the a simple landing page",
    "type": "Catalog",
    "conformsTo" : [
        "https://api.stacspec.org/v1.0.0-beta.5/core"
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
            "href": "https://stac-api.example.com/catalogs/sentinel-2",
        },
        {
            "rel": "child",
            "type": "application/json",
            "href": "https://stac-api.example.com/catalogs/landsat-8",
        }
    ]
}
```

## Extensions

None.

## Structuring Catalog Hierarchies

A STAC API is more useful when it presents a complete `Catalog` representation of all the data contained in the
API, such that all `Item` objects can be reached by transitively traversing `child` and `item` link relations from
the root. This property of being able to reach all Items in this way is formalized in the
[*STAC API - Browseable* conformance class](../browseable/README.md), but any Catalog can be structured for hierarchical traversal. 
Implementers who have search as their primary use case should consider also implementing this
alternate view over the data by presenting it as a directed graph of catalogs, where the `child` link relations typically
form a tree, and where each catalog can be retrieved with a single request (e.g., each Catalog JSON is small enough that
it does not require pagination).

While OAFeat requires that all Items must be part of a Collection, this does not mean that the Collection needs to be
part of the browseable tree. If they are part of the tree, it is recommended that there only be one Collection in a
path through the tree, and that a collection never contain child collections.

These are the two standard ways of structuring a browseable tree of catalogs, the only difference being
whether the Collection is used as part of the tree or not:

- Catalog (root) -> Catalog* -> Item (recommended)
- Catalog (root) -> Collection -> Catalog* -> Item

All items must be part of a Collection, but the Collection itself does not need to be part of the browsable graph.

How you structure your graph of Catalogs can allow you to both group Collections together and create sub-groups
of items within a Collection. 
For example, your collections may be grouped so each represent a data product. This might mean
you have a collection for each of Landsat 8 Collection 1, Landsat 8 Surface Reflectance, Sentinel-2 L1C, Sentinel-2
L2A, Sentinel-5P UV Aerosol Index, Sentinel-5P Cloud, MODIS MCD43A4, MODIS MOD11A1, and MODIS MYD11A1. You can also
present each of these as a catalog, and create parent catalogs for them that allow you to group together all Landsat, Sentinel, and MODIS catalogs.

- / root catalog
  - child -> /catalogs/landsat
    - child -> /catalogs/landsat_7
    - child -> /catalogs/landsat_8
      - child -> /catalogs/landsat_8_c1
      - child -> /catalogs/landsat_8_sr
  - child -> /catalogs/sentinel
    - child -> /catalogs/sentinel_2
      - child -> /catalogs/sentinel_2_l1c
      - child -> /catalogs/sentinel_2_l2a
    - child -> /catalogs/sentinel_5p
      - child -> /catalogs/sentinel_5p_uvai
      - child -> /catalogs/sentinel_5p_cloud
  - child -> /catalogs/modis
    - child -> /catalogs/modis_mcd43a4
    - child -> /catalogs/modis_mod11a1 
    - child -> /catalogs/modis_myd11a1

Each of these catalog endpoints could in turn be its own STAC API root, allowing an interface where users can
search over arbitrary groups of collections without needing to explicitly know and name every collection in the
search `collection`  query parameter. These catalogs-of-catalogs can be separated multiple ways, e.g. be
per provider (e.g., Sentinel-2), per domain (e.g., cloud data), or per form of data (electro-optical, LIDAR, SAR).

Going the other direction, collections can be sub-grouped into smaller catalogs. For example, this example
groups a catalog of Landsat 8 Collection 1 items by path, row, and date (the path/row system is used by this
product for gridding). 

- / (root)
  - /catalogs/landsat_8_c1
    - /catalogs/landsat_8_c1/139
      - /catalogs/landsat_8_c1/139_045
        - /catalogs/landsat_8_c1/139_045_20170304
          - /collections/landsat_8_c1/items/LC08_L1TP_139045_20170304_20170316_01_T1
        - /catalogs/landsat_8_c1/139_045_20170305
          - /collections/landsat_8_c1/items/LC08_L1TP_139045_20170305_20170317_01_T1
      - /catalogs/landsat_8_c1/139_046
        - /catalogs/landsat_8_c1/139_046_20170304
          - /collections/landsat_8_c1/items/LC08_L1TP_139046_20170304_20170316_01_T1
        - /catalogs/landsat_8_c1/139_046_20170305
          - /collections/landsat_8_c1/items/LC08_L1TP_139046_20170305_20170317_01_T1

If done in a consistent manner, these can also provide "templated" URIs, such that a user could directly request a
specific path, row, and date simply by replacing the values in `/catalogs/landsat_8_c1/{path}_{row}_{date}`.

Similarly, a MODIS product using sinusoidal gridding could use paths of the form
`/{horizontal_grid}/{vertical_grid}/{date}`. Since only around 300 scenes produced every day for a MODIS product
and there is a 20 year history of production, these could be fit in a graph with path length 3 from the root
Catalog to each leaf Item.

- / (root)
  - `/catalogs/mcd43a4 (~7,000 `child` relation links, one to each date)
    - `/catalogs/mcd43a4/{date}` (~300 `item` relation links to each Item)
      - `/collections/mcd43a4/items/{itemId}`
      - ...

Catalogs can also group related products. For example, here we group together synthetic aperture radar (SAR) products
(Sentinel-1 and AfriSAR) and electro-optical (EO) bottom of atmosphere (BOA) products.

- / root catalog
  - child -> /catalogs/sar
    - child -> /catalogs/sentinel_1_l2a
    - child -> /catalogs/afrisar
  - child -> /catalogs/eo_boa
    - child -> /catalogs/landsat_8_sr
    - child -> /catalogs/sentinel_2_l2a

The catalogs structure is a directed graph that allows 
you to provide numerous different Catalog and Collection graphs to reach leaf Items. For example, for a Landsat 8 data
product, you may want to allow browsing both by date then path then row, or by path then row then date:

1. Catalog -> Catalog (product) -> Catalog (date) -> Catalog (path) -> Catalog (row)
2. Catalog -> Catalog (product) -> Catalog (path) -> Catalog (row) -> Catalog (date)

When more than path to an Item is allowed, it is recommended that the final `item` link relation reference a
consistent, canonical URL for each item, instead of a URL that is specific to the path of Catalog that was followed
to reach it.

There are many options for how to structure these catalog graphs, so it will take some analysis work to figure out
which one or ones best match the structure of your data and the needs of your consumers.
