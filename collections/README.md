# STAC API - Collections

- [STAC API - Collections](#stac-api---collections)
	- [Link Relations](#link-relations)
	- [Endpoints](#endpoints)
	- [Example](#example)
	- [Conformance](#conformance)

- **OpenAPI specification:** Missing
- **Conformance URI:** <http://stacspec.org/spec/api/1.0.0-beta.2/extensions/collections>
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

The following Link relations should exist in the Landing Page (root).

| **rel**        | **href**             | **From**       | **Description** |
| -------------- | -------------------- | -------------- | ---------------- |
| `root`         | `/`                  | STAC Core      | The root URI |
| `self`         | `/`                  | OAFeat         | Self reference, same as root URI |
| `service-desc` | `/api` (recommended) | OAFeat OpenAPI | The OpenAPI service description. Uses the `application/vnd.oai.openapi+json;version=3.0` media type to refer to the OpenAPI 3.0 document that defines the service's API |
| `child`        | various              | STAC Core      | The child STAC Catalogs & Collections. Provides curated paths to get to STAC Collection and Item objects |
| `data` | `/collections` | OAFeat | List of Collections |

Additionally, a `service-doc` endpoint is recommended.

| **rel**      | **href** | **From**       | **Description** |
| ------------ | -------- | -------------- |----------------- |
| `service-doc`  | `/api.html` (recommended) | OAFeat OpenAPI | An HTML service description.  Uses the `text/html` media type to refer to a human-consumable description of the service |

## Endpoints

| Endpoint                                        | Returns          | Description |
| ----------------------------------------------- | ---------------- | ----------- |
| `/collections`                                  | JSON             | Object with a list of Collections contained in the catalog and links |
| `/collections/{collectionId}`                   | Collection       | Returns single Collection JSON |

STAC API's implementing the Collections class must support HTTP GET operation at `/collections`, with the return JSON document consisting
of an array of all STAC Collections and an array of Links.

## Example

```json
{
	"collections": [
		{
			"stac_version": "1.0.0-beta.2",
			"stac_extensions": [ ],
			"id": "cool-data",
			"title": "Cool Data from X Satellite",
			"description": "A lot of awesome words describing the data",
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
					"href": "https://myservice.com/collections/cool-data"
				},
			],
		}
	],
	"links": [
		{
			"rel": "self",
			"type": "application/json",
			"href": "https://myservice.com/collections"
		}
	]
}
```

The above is a minimal example, but captures the essence. Each collection object must be a valid STAC 
[Collection](../stac-spec/collection-spec/README.md), and each should have a `self` link that communicates its canonical location. And then 
the links section must include a `self` link, and it should also link to alternate representations (like html) of the collection.

Each collection must also be accessible from `/collections/{collectionId}`. Usually this will be the location provided by the `self` link,
but implementations may choose to list the canonical location elsewhere. But `/collections/{collectionId}` must always contain the response, 
and if the canonical location is elsewhere it is recommended to include a `rel` of `canonical` from `/collections/{collectionId}` to that location.

## Conformance

Any implementation that provides the STAC Collection functionality described above must add `http://stacspec.org/spec/api/1.0.0-beta.2/collections`,
the conformance URI, to the `conformsTo` JSON at the landing page.

The core STAC landing page (`/`) must also include a link with a `rel` of `data` that links to the `/collections` endpoint.

**NOTE**: *When this aligns with OGC API - Common it will also need to add it to the `/conformance` endpoint.*
