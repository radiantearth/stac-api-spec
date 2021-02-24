# STAC API - Core Specification

- **OpenAPI specification:** [openapi.yaml](openapi.yaml) describes the core endpoints ([rendered version](https://api.stacspec.org/v1.0.0-beta.1/core)),
  and [commons.yaml](commons.yaml) is the OpenAPI version of the core [STAC spec](../stac-spec) JSON Schemas.
- **Conformance URI:** <https://api.stacspec.org/v1.0.0-beta.1/core>
- **Extension [Maturity Classification](../extensions.md#extension-maturity):** Pilot
- **Dependencies**: None

The core of a STAC API is its landing page, which is the starting point to discover STAC data and what the API supports.

```json
{
    "stac_version": "1.0.0-beta.2",
    "id": "example-stac",
    "title": "A simple STAC API Example",
    "description": "This Catalog aims to demonstrate the a simple landing page",
    "links": [
        {
            "rel": "child",
            "href": "https://stacserver.org/collections/sentinel-2",
        },
        {
            "rel": "child",
            "href": "https://stacserver.org/collections/landsat-8",
        },
        {
            "rel": "search",
            "type": "application/json",
            "href": "https://stacserver.org/search"
        }
    ],
    "conformsTo" : [
        "https://api.stacspec.org/v1.0.0-beta.1/core",
        "https://api.stacspec.org/v1.0.0-beta.1/item-search"
    ]
}
```

There are a few requirements for the returned document:

- The returned JSON must be a valid [STAC Catalog](../stac-spec/catalog-spec/catalog-spec.md), and it can provide any number of 'child' links
to navigate down to additional Catalogs, Collections & Items.
- The `links` section is a required part of STAC Catalog, and serves as the list of API endpoints. These can live at any location, the 
client must inspect the the `rel` (relationship) to understand what capabilities are offered at each location.
- The `conformsTo` section must provide the capabilities of this service. The relevant conformance URI's are listed in each part of the
API specification. If a conformance URI is listed then the service must implement all of the required capabilities.

Note the `conformsTo` JSON object follows exactly the structure of OGC API - Features [declaration of conformance 
classes](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_declaration_of_conformance_classes), except is available directly under 
the landing page. This is a slight break from how OGC API does things, as STAC feels it is important for clients to be able to understand
conformance in a single request. To be conformant to OGC API's the `/conformance` endpoint must be implemented as well.

This particular catalog provides the ability to browse down to STAC Collections through its `child` links, and also provides the search
endpoint to be able to search across items in its collections. Note though that none of those links are required, other servers may provide
different conformance classes and a different set of links. 

The only requirements of the STAC API core class are to provide a valid STAC Catalog that includes a valid `conformsTo` JSON object
in it. Any API implementing that is considered a valid STAC API, and clients can inspect the document to figure out what other
capabilities are on offer and how to reach them.

The root endpoint (`/`) is most useful when it presents a complete `Catalog` representation of all the data contained in the API, such 
that all `Collections` and `Items` can be navigated to by transitively traversing links from this root. This spec does not require any 
API endpoints from OAFeat or STAC API to be implemented, so the following links may not exist if the endpoint has not been implemented.

## Potential Link Relations at `/`

| **`rel`** | **href to**                                | **From**           | **Description**                                                  |
|-----------|--------------------------------------------|--------------------|------------------------------------------------------------------|
| `child`   | The child STAC Catalogs & Collections      | STAC Core          | Provides curated paths to get to STAC Collections and Items      |
| `data`    | OAFeat/OACommon `/collections` endpoint    | Commons Collection | The full list of Collections provided by the API                 |
| `search`  | The STAC search endpoint (often `/search`) | STAC Search        | Cross-collection query endpoint to select sub-sets of STAC Items |
| `service-desc` | The OpenAPI description of this service | OAFeat OpenAPI   | Uses the `application/vnd.oai.openapi+json;version=3.0` media type to refer to the OpenAPI 3.0 document that defines the service's API |
| `conformance` | OGC `/conformance` endpoint            | OAFeat / OACommon  | Only required for OGC API Compliant implementations              |

It is also valid to have `item` links from the landing page, but most STAC API's are used to serve up a massive amount of features, so they typically
use several layers of `child` links before getting to Items.
