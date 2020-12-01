# STAC API - Collections

| **Name**             | **Conformance URI**                          | **Dependencies** |
|----------------------|----------------------------------------------|------------------|
| STAC Collections | <http://stacspec.org/spec/api/1.0.0-beta.1/collections> | None             |

A STAC API can return information about all STAC [Collections](stac-spec/collections-spec/collections-spec.md) available using a link
from the landing page that uses the `data` rel, which links to an endpoint called `/collections`. Individual STAC collections can be accessed
by providing the Collection `id` as a path past that endpoint: `/collections/{collectionId}`.

**NOTE**: *This conformance class is directly based on [OGC API - Common - Part 2: Geospatial Data](http://docs.opengeospatial.org/DRAFTS/20-024.html),
and will aim to align with it as soon as it is released as a request for comment. But it still seems to be in flux.*

| Endpoint                                        | Returns          | Description |
| ----------------------------------------------- | ---------------- | ----------- |
| `/collections`                                  | JSON             | Object with a list of Collections contained in the catalog and links |
| `/collections/{collectionId}`                   | Collection       | Returns single Collection JSON |

TODO: Add a bit more here. Probably specify the itemType, perhaps mention that other (non-STAC) collections may be returned here.


## Conformance

Any implementation that provides the STAC Collection functionality described above must add `http://stacspec.org/spec/api/1.0.0-beta.1/collections`,
the conformance URI, to the `conformsTo` JSON at the landing page.

**NOTE**: *When this aligns with OGC API - Common it will also need to add it to the `/conformance` endpoint.*

specifies a [Collections requirements 
class](http://docs.opengeospatial.org/DRAFTS/20-024.html#rc_collections-section) that describes how to request information on Collections
from an API. This provides the `data` rel type, that links to a list of collections that can all be referred to by ID. It is most often used
in conjunction with STAC Response, to return valid STAC Collections.

TODO: Consider making this just a STAC Collection thing, and align with OGC Common later, so we don't have depend on a draft, where 
we'd need to link to a particular commit to reference it.