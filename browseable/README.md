# STAC API - Browseable Specification

- [STAC API - Browseable Specification](#stac-api---browseable-specification)
  - [Link Relations](#link-relations)
  - [Endpoints](#endpoints)
  - [Example Landing Page for STAC API - Browseable](#example-landing-page-for-stac-api---browseable)
  - [Extensions](#extensions)

- **OpenAPI specification:** none
- **Conformance URIs:** 
  - <https://api.stacspec.org/v1.0.0-beta.5/browseable>
  - <https://api.stacspec.org/v1.0.0-beta.5/core>
- **Extension [Maturity Classification](../extensions.md#extension-maturity):** Pilot
- **Dependencies**: [STAC API - Core](../core)

A STAC API conforming to the `STAC API - Browseable` conformance class must be structured such that all 
all Items in the catalog can be accessed by following `child` and `item` link relations. This is a more significant
constraint than a STAC API without this conformance class or a STAC Catalog that is available over HTTP but does not
implement STAC API, neither of which have any guarantee regarding the reachability of Items.

Recommendations for structuring Catalogs hierarchically can be found in
[Structuring Catalog Hierarchies](../core/README.md#structuring-catalog-hierarchies) from the `STAC API - Core` specification.

## Link Relations

This conformance class also requires implementation of the link relations in the [STAC API - Core](../core) conformance class.

Additionally, `child` relations must exist to child Catalogs and Collections and `item` relations to Items, such that
every Item in the Catalog can be accessed by traversing these relations.

| **rel** | **href** | **From**  | **Description**                        |
| ------- | -------- | --------- | -------------------------------------- |
| `child` | various  | STAC Core | The child STAC Catalogs & Collections. |
| `item`  | various  | STAC Core | The child STAC Items.                  |

Note that there is a different link relation `items` (plural)
used by the `STAC API - Features` conformance class that links from a collection to the items in
that collection.

## Endpoints

This conformance class also requires for the endpoints in the [STAC API - Core](../core) conformance class to be implemented.

This conformance class adds no additional endpoints.

## Example Landing Page for STAC API - Browseable

This JSON is what would be expected from an API that implements `STAC API - Browseable`. 

This particular catalog provides both the ability to browse down to child Catalog objects through its
`child` links, and also provides the search endpoint to be able to search across items in its collections. Note
that some of those links are not required and other servers may provide
different conformance classes and a different set of links. 

```json
{
    "stac_version": "1.0.0",
    "id": "example-stac",
    "title": "A simple STAC API Example, implementing STAC API - Browseable",
    "description": "This Catalog aims to demonstrate the a simple landing page",
    "type": "Catalog",
    "conformsTo" : [
        "https://api.stacspec.org/v1.0.0-beta.5/core",
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
            "rel": "child",
            "type": "application/json",
            "href": "https://stacserver.org/catalogs/sentinel-2",
        },
        {
            "rel": "child",
            "type": "application/json",
            "href": "https://stacserver.org/catalogs/landsat-8",
        }
    ]
}
```

## Extensions

None.
