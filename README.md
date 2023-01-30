<!--lint disable no-html-->
<img src="https://github.com/radiantearth/stac-site/raw/master/images/logo/stac-030-long.png" alt="stac-logo" width="700"/>

# STAC API Foundation Specifications

- [STAC API Foundation Specifications](#stac-api-foundation-specifications)
  - [Releases (stable)](#releases-stable)
  - [Development (unstable)](#development-unstable)
  - [About](#about)
  - [Stability Note](#stability-note)
  - [Maturity Classification](#maturity-classification)
  - [Communication](#communication)
  - [In this repository](#in-this-repository)
  - [Contributing](#contributing)

## Releases (stable)

- [v1.0.0-rc.2](https://github.com/radiantearth/stac-api-spec/tree/v1.0.0-rc.2) (latest)
- [v1.0.0-rc.1](https://github.com/radiantearth/stac-api-spec/tree/v1.0.0-rc.1)
- [v1.0.0-beta.5](https://github.com/radiantearth/stac-api-spec/tree/v1.0.0-beta.5)
- [v1.0.0-beta.4](https://github.com/radiantearth/stac-api-spec/tree/v1.0.0-beta.4)
- [v1.0.0-beta.3](https://github.com/radiantearth/stac-api-spec/tree/v1.0.0-beta.3)
- [v1.0.0-beta.2](https://github.com/radiantearth/stac-api-spec/tree/v1.0.0-beta.2)
- [v1.0.0-beta.1](https://github.com/radiantearth/stac-api-spec/tree/v1.0.0-beta.1)
- [v0.9.0](https://github.com/radiantearth/stac-api-spec/tree/v0.9.0)

## Development (unstable)

The [main](https://github.com/radiantearth/stac-api-spec/tree/main) branch in GitHub is
used for active development and may be unstable. Implementers should reference one of
the release branches above for a stable version of the specification.
**NOTE**: This means that if you are on github.com/radiantearth/stac-api-spec then you are looking at an unreleased,
unstable version of the specification. Use the first listed link on releases to read the current released, stable version
of the spec.

## About

The SpatioTemporal Asset Catalog (STAC) family of specifications aim to standardize the way geospatial asset metadata is structured and queried.
A 'spatiotemporal asset' is any file that represents information about the Earth captured in a certain space and 
time. The core STAC specifications live in the GitHub repository [radiantearth/stac-spec](https://github.com/radiantearth/stac-spec).

A STAC API is a dynamic version of a SpatioTemporal Asset Catalog. This repository defines the three
STAC API foundation specifications -- [STAC API - Core](core/),
[STAC API - Features](ogcapi-features/), and [STAC API - Item Search](item-search/) -- which can be composed 
with [Extensions](extensions.md) to define a specific STAC API implementation.

A STAC API can be used to retrieve STAC [Catalog](stac-spec/catalog-spec/catalog-spec.md), 
[Collection](stac-spec/collection-spec/collection-spec.md), [Item](stac-spec/item-spec/item-spec.md), 
or STAC API [ItemCollection](fragments/itemcollection/README.md) objects from various endpoints.
Catalog and Collection objects are JSON, while Item and ItemCollection objects are GeoJSON-compliant entities with foreign members.
Typically, a Feature is used when returning a single Item object, and FeatureCollection when multiple Item objects (rather than a 
JSON array of Item entities).

The API can be implemented in compliance with the *[OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html)* standard 
(OAFeat is a shorthand). In this case STAC API can be thought of as a specialized Features API 
to search STAC catalogs, where the features returned are STAC [Item](stac-spec/item-spec/item-spec.md) objects, 
that have common properties, links to their assets and geometries that represent the footprints of the geospatial assets.

The specification for STAC API is provided as files that follow the [OpenAPI](http://openapis.org/) 3.0 specification, 
rendered online into HTML at <https://api.stacspec.org/v1.0.0-rc.2>, in addition to human-readable documentation.  

## Stability Note

This specification has evolved over the past couple years, and is used in production in a variety of deployments. It is 
currently in a 'beta' state, with no major changes anticipated. For v1.0.0-rc.2, we remain fully aligned with [OGC API - 
Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html) Version 1.0, and we are working to stay aligned
as the additional OGC API components mature. This may result in minor changes as things evolve. The STAC API 
specification follows [Semantic Versioning](https://semver.org/), so once 1.0.0 is reached any breaking change 
will require the spec to go to 2.0.0.

## Maturity Classification

Conformance classes and extensions are meant to evolve to maturity, and thus may be in different states
in terms of stability and number of implementations. All extensions must include a 
maturity classification, so that STAC API spec users can easily get a sense of how much they can count
on the extension. 

| Maturity Classification | Min Impl # | Description                                                                                                                                                | Stability                                                                                                 |
| ----------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Proposal                | 0          | An idea put forward by a community member to gather feedback                                                                                               | Not stable - breaking changes almost guaranteed as implementers try out the idea.                         |
| Pilot                   | 1          | Idea is fleshed out, with examples and a JSON schema, and implemented in one or more catalogs. Additional implementations encouraged to help give feedback | Approaching stability - breaking changes are not anticipated but can easily come from additional feedback |
| Candidate               | 3          | A number of implementers are using it and are standing behind it as a solid extension. Can generally count on an extension at this maturity level          | Mostly stable, breaking changes require a new version and minor changes are unlikely.                     |
| Stable                  | 6          | Highest current level of maturity. The community of extension maintainers commits to a STAC review process for any changes, which are not made lightly.    | Completely stable, all changes require a new version number and review process.                           |
| Deprecated              | N/A        | A previous extension that has likely been superseded by a newer one or did not work out for some reason.                                                   | Will not be updated and may be removed in an upcoming major release.                                      |

Maturity mostly comes through diverse implementations, so the minimum number of implementations
column is the main gating function for an extension to mature. But extension authors can also
choose to hold back the maturity advancement if they don't feel they are yet ready to commit to
the less breaking changes of the next level.

A 'mature' classification level will likely be added once there are extensions that have been 
stable for over a year and are used in twenty or more implementations.

## Communication

For any questions feel free to jump on our [gitter channel](https://gitter.im/SpatioTemporal-Asset-Catalog/Lobby) or email 
our [google group](https://groups.google.com/forum/#!forum/stac-spec). The majority of communication about the evolution of 
the specification takes place in the [issue tracker](https://github.com/radiantearth/stac-api-spec/issues) and in 
[pull requests](https://github.com/radiantearth/stac-api-spec/pulls).

## In this repository

The **[Overview](overview.md)** document describes all the various parts of the STAC API and how they fit together.

**STAC API - Core:**
The *[core](core/)* folder describes the core STAC API specification that enables browsing catalogs and 
retrieving the API capabilities. This includes the OpenAPI schemas for STAC Item, Catalog and Collection objects.

**STAC API - Features:**
The *[ogcapi-features](ogcapi-features)* folder describes how a STAC API can fully implement [OGC API - 
Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html) to expose individual `items` endpoints for search of
each STAC collection. It also includes extensions that can be used to further enhance OAFeat.

**STAC API - Item Search Specification:**
The *[item-search](item-search)* folder contains the Item Search specification, which enables 
cross-collection search of STAC Item objects at a `search` endpoint, as well as a number of extensions. 

**Extensions:**
The *[extensions](extensions.md) document* describes how STAC adds new functionality
through extensions. The official list of STAC API Extensions
is maintained [here](https://stac-api-extensions.github.io).

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

**Implementation Recommendations:** Recommendations for implementing a STAC API may be found [here](implementation.md). 
These are mostly concerns that apply to an entire API implementation and are not part of the specification itself.

## Contributing

Anyone building software that catalogs imagery or other geospatial assets is welcome to collaborate.
Beforehand, please review our [guidelines for contributions and development process](CONTRIBUTING.md).
