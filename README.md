<img src="https://github.com/radiantearth/stac-site/raw/master/images/logo/stac-030-long.png" alt="stac-logo" width="700"/>

# STAC API

## About

The SpatioTemporal Asset Catalog (STAC) specification aims to standardize the way geospatial assets are exposed online and queried. 
A 'spatiotemporal asset' is any file that represents information about the earth captured in a certain space and 
time. The core STAC specification lives at [gitub.com/radiantearth/stac-spec](https://github.com/radiantearth/stac-spec).

A STAC API is the dynamic version of a SpatioTemporal Asset Catalog. It returns a STAC [Catalog](stac-spec/catalog-spec/catalog-spec.md), 
[Collection](stac-spec/collection-spec/collection-spec.md), [Item](stac-spec/item-spec/item-spec.md), 
or a STAC API [ItemCollection](fragments/itemcollection/README.md), depending on the endpoint.
Catalogs and Collections are JSON, while Items and ItemCollections are GeoJSON-compliant entities with foreign members.  
Typically, a Feature is used when returning a single Item, and FeatureCollection when multiple Items (rather than a JSON array of Item entities).

The API can be implemented in compliance with the *[OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html)* standard 
(we'll use OAFeat for shorthand). In this case STAC API can be thought of as a specialized Features API 
to search STAC Catalogs, where the features returned are STAC [Items](stac-spec/item-spec/item-spec.md), 
that have common properties, links to their assets and geometries that represent the footprints of the geospatial assets.

The specification for STAC API is provided as files that follow the [OpenAPI](http://openapis.org/) 3.0 specification, 
rendered online into HTML at <https://api.stacspec.org/v1.0.0-beta.1>, in addition to human-readable documentation.  

## Stability Note

This specification has evolved over the past couple years, and is used in production in a variety of deployments. It is 
currently in a 'beta' state, with no major changes anticipated. For 1.0-beta we remain fully aligned with [OGC API - 
Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html) Version 1.0, and we are working to stay aligned
as the additional OGC API components mature. This may result in minor changes as things evolve. The STAC API specification 

follows [Semantic Versioning](https://semver.org/), so once 1.0.0 is reached any breaking change will require the spec to 
go to 2.0.0. 

## Communication

For any questions feel free to jump on our [gitter channel](https://gitter.im/SpatioTemporal-Asset-Catalog/Lobby) or email 
our [google group](https://groups.google.com/forum/#!forum/stac-spec). The majority of communication about the evolution of 
the specification takes place in the [issue tracker](https://github.com/radiantearth/stac-api-spec/issues) and in 
[pull requests](https://github.com/radiantearth/stac-api-spec/pulls).

## In this repository

The **[Overview](overview.md)** document describes all the various parts of the STAC API and how they fit together.

**STAC API - Core Specification:**
The *[core](core/)* folder describes the core STAC API specification that enables browsing catalogs and 
retrieving the API capabilities. This includes the OpenAPI schemas for STAC items, catalogs and collections.

**STAC API - Item Search Specification:**
The *[item-search](item-search)* folder contains the Item Search specification, which enables 
cross-collection search of STAC Items at a `search` endpoint, as well as a number of extensions. 

**STAC API - Features:**
The *[ogcapi-features](ogcapi-features)* folder describes how a STAC API can fully implement [OGC API - 
Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html) to expose individual `items` endpoints for search of
each STAC collection. It also includes extensions that can be used to further enhance OAFeat.

**Extensions:**
The *[extensions](extensions.md) document* describes how STAC incubates new functionality, and it links to the existing 
extensions that can be added to enrich the functionality of a STAC API. Each has an OpenAPI yaml, but some of the yaml
documents live as fragments in the [fragments/](fragments/) folder.

**Fragments:**
The *[fragments/](fragments/)* folder contains re-usable building blocks to be used in a STAC API, including common OpenAPI 
schemas and parameters for behavior like sorting and filtering. Most all of them are compatible with 
OGC API - Features, and the plan is to fully align the relevant functionality and have it be useful for all OAFeat implementations.
OpenAPI YAML documents are provided for each extension with additional documentation and examples provided in a README.

**STAC Specification:** This repository includes a '[sub-module](https://git-scm.com/book/en/v2/Git-Tools-Submodules)', which
is a copy of the [STAC specification](stac-spec/) tagged at the latest stable version.
Sub-modules aren't checked out by default, so to get the directory populated
either use `git submodule update --init --recursive` if you've already cloned it,
or clone from the start with `git clone --recursive git@github.com:radiantearth/stac-api-spec.git`. 

## Contributing

Anyone building software that catalogs imagery or other geospatial assets is welcome to collaborate.
Beforehand, please review our [guidelines for contributions and development process](CONTRIBUTING.md).
