# STAC API - Core Specification

- [STAC API - Core Specification](#stac-api---core-specification)
  - [Recommended Link Relations at `/`](#recommended-link-relations-at-)
  - [Example Landing Page for STAC API - Core](#example-landing-page-for-stac-api---core)

- **OpenAPI specification:** [openapi.yaml](openapi.yaml) describes the core endpoints ([rendered version](https://api.stacspec.org/v1.0.0-beta.1/core)),
  and [commons.yaml](commons.yaml) is the OpenAPI version of the core [STAC spec](../stac-spec) JSON Schemas.
- **Conformance URI:** <https://api.stacspec.org/v1.0.0-beta.1/core>
- **Extension [Maturity Classification](../extensions.md#extension-maturity):** Pilot
- **Dependencies**: None

The base of a STAC API is its landing page. This resource is the starting point to discover what behaviors 
the API supports via the `conformsTo` values and link relations. 
This behavior in a RESTful API is known as 
[Hypermedia as the Engine of Application State (HATEOAS)](https://en.wikipedia.org/wiki/HATEOAS). 
STAC API relies heavily on hypermedia for API resource navigation. 

There are a few requirements for the returned document:

- The returned JSON must be a valid [STAC Catalog](../stac-spec/catalog-spec/catalog-spec.md), and it can provide any number of 'child' links
to navigate down to additional Catalog, [Collection](../stac-spec/collection-spec/README.md), and [Item](../stac-spec/item-spec/README.md) objects.
- The `links` section is a required part of STAC Catalog, and serves as the list of API endpoints. These can live at any location, the 
client must inspect the the `rel` (relationship) to understand what capabilities are offered at each location.
- The `conformsTo` section must provide the capabilities of this service. This is the field
  that indicates to clients that this is a STAC API and how to access conformance classes, including this
  one. The relevant conformance URI's are listed in each part of the
  API specification. If a conformance URI is listed then the service must implement all of the required capabilities.

Note the `conformsTo` JSON object follows exactly the structure of OGC API - Features [declaration of conformance 
classes](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_declaration_of_conformance_classes), except is available directly under 
the landing page. This is a slight break from how OGC API does things, as STAC feels it is important for clients to be able to understand
conformance in a single request. Implementers choosing to also implement the OGC API - Features and/or 
STAC API - Features conformance classes must also implment the `/conformance` endpoint.

This particular catalog provides the ability to browse down to child STAC Collection objects through its `child` links, and also provides the search
endpoint to be able to search across items in its collections. Note though that none of those links are required, other servers may provide
different conformance classes and a different set of links. 

The only requirements of the STAC API core class are to provide a valid STAC Catalog that includes a valid `conformsTo` JSON object
in it. Any API implementing that is considered a valid STAC API, and clients can inspect the document to figure out what other
capabilities are on offer and how to reach them.

The root endpoint (`/`) is most useful when it presents a complete `Catalog` representation of all the data contained in the API, such 
that all `Collection` and `Item` objects can be navigated to by transitively traversing links from this root. This spec does not require any 
API endpoints from OAFeat or STAC API to be implemented, so the following links may not exist if the endpoint has not been implemented.

## Recommended Link Relations at `/`

When implementing the STAC API Core conformance class, it it recommended to implement these Link relations.

| **`rel`**      | **href to**                           | **From**       | **Description**                                                                                                                        |
| -------------- | ------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `root`         | The root URI                          | STAC Core      | Reference to self URI                                                                                                                  |
| `self`         | The root URI                          | OAFeat         | Reference to self URI                                                                                                                  |
| `service-desc` | The OpenAPI service description       | OAFeat OpenAPI | Uses the `application/vnd.oai.openapi+json;version=3.0` media type to refer to the OpenAPI 3.0 document that defines the service's API |
| `service-doc`  | An HTML service description           | OAFeat OpenAPI | Uses the `text/html` media type to refer to a human-consumable description of the service                                              |
| `child`        | The child STAC Catalogs & Collections | STAC Core      | Provides curated paths to get to STAC Collection and Item objects                                                                      |

It is also valid to have `item` links from the landing page, but most STAC API services are used to 
serve up a large number of features, so they typically
use several layers of intermediate `child` links before getting to Item objects.

## Example Landing Page for STAC API - Core

This JSON is what would be expected from an api that only implements STAC API - Core. In practice, 
most APIs will also implement other conformance classes, and those will be reflected in the `links` and 
`conformsTo` fields.  A more typical Landing Page example is in 
the [overview](../overview.md#example-landing-page) document.

```json
{
    "stac_version": "1.0.0-beta.2",
    "id": "example-stac",
    "title": "A simple STAC API Example",
    "description": "This Catalog aims to demonstrate the a simple landing page",
    "conformsTo" : [
        "https://api.stacspec.org/v1.0.0-beta.1/core"
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
            "rel": "child",
            "type": "application/json",
            "href": "https://stacserver.org/collections/sentinel-2",
        },
        {
            "rel": "child",
            "type": "application/json",
            "href": "https://stacserver.org/collections/landsat-8",
        }
    ]
}
```
