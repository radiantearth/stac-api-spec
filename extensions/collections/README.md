# OGC API - Common - Part 2: Collections

| **Name**             | **Conformance URI**                                           | **Dependencies** |
|----------------------|-------------------------------------------------------------------|------------------|
| OACommon Collections | <http://www.opengis.net/spec/ogcapi_common-2/1.0/req/collections> | None             |

[OGC API - Common - Part 2: Geospatial Data](http://docs.opengeospatial.org/DRAFTS/20-024.html) specifies a [Collections requirements 
class](http://docs.opengeospatial.org/DRAFTS/20-024.html#rc_collections-section) that describes how to request information on Collections
from an API. This provides the `data` rel type, that links to a list of collections that can all be referred to by ID. It is most often used
in conjunction with STAC Response, to return valid STAC Collections.

TODO: Consider making this just a STAC Collection thing, and align with OGC Common later, so we don't have depend on a draft, where 
we'd need to link to a particular commit to reference it.