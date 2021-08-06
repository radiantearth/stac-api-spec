# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

## [v1.0.0-beta.3] - 2020-08-06

### Added
- Added STAC API - Collections definition (subset of STAC API - Features)

### Changed
- Query extension not deprecated; recommendation to use Filter (https://github.com/radiantearth/stac-api-spec/pull/157)
- Filter Extension conformance classes refactored to better align with STAC API use cases.

### Deprecated

### Removed
- Remove stac_version and stac_extensions fields in ItemCollection

### Fixed
  
## [v1.0.0-beta.2] - 2020-06-01

### Added
- Added Filter extension to integrate OAFeat Part 3 CQL
- Catalog and Collection definitions now have required field "type"
- Added recommendation to enable CORS for public APIs

### Changed
- Updated all STAC versions to 1.0.0
- Passing the `ids` parameter to an item search does not deactivate other query parameters [#125](https://github.com/radiantearth/stac-api-spec/pull/125)
- The first extent in a Collection is always the overall extent, followed by more specific extents. [opengeospatial/ogcapi-features#520](https://github.com/opengeospatial/ogcapi-features/pull/520)

### Deprecated
- Query extension is now deprecated. Replaced by the Filter extension using OGC CQL.

### Removed

### Fixed
- Updated text description of root ('/') endpoint (also called landing page) that the return type is a Catalog

## [v1.0.0-beta.1] - 2020-12-10

### Added
- The landing page returns the conformance classes in a property `conformsTo`, which mirrors `GET /conformances` from OGC APIs.
- Conformance classes for all the major functionality and extensions, to be referenced in a new `conformsTo` JSON object in the landing page.
- Fragments: reusable OpenAPI documents for sort, filter, fields and context, along with explanation of how they work.
- ItemCollection moved from [STAC Core](https://github.com/radiantearth/stac-spec/blob/v0.9.0/item-spec/itemcollection-spec.md) to this repo.

### Changed
- Major re-organization of the content and directory structure to make better conformance classes.
  - STAC API Core is the landing page (a STAC catalog and conformance information).
  - Item Search is the `search` cross-collection item search resource.
  - STAC API - Features is the OGC API - Features standards to be used in a STAC API.
  - Extensions are specified in the relevant functionality directory, though they can share openapi yaml's in the 'fragments' directory.
- Updated to STAC specification version 1.0.0-beta.2
- Named explicit supported STAC core versions to be from 0.9.0 up to (and not including) 2.0.0
- Context Extension OpenAPI spec was updated to remove the no longer used `next` attribute
- Added root endpoint Link `search` must have `type` of `application/geo+json`
- Corrected the description of endpoint `/collections` to say it returns an object per OAFeat, instead of an array of Collection
- Updated transaction extension so it aligns with OGC API - Features Part 4: Simple Transactions

### Deprecated

### Removed

### Fixed
- BBOX openapi yaml to only allow 4 or 6 element arrays
- Fixed invalid OpenAPI files

## Older versions

See the [stac-spec CHANGELOG](https://github.com/radiantearth/stac-spec/blob/v0.9.0/CHANGELOG.md)
for STAC API releases prior to or equal to version 0.9.0.

[Unreleased]: <https://github.com/radiantearth/stac-api-spec/compare/master...dev>
[v1.0.0-beta.1]: <https://github.com/radiantearth/stac-api-spec/tree/v1.0.0-beta.1>
[v1.0.0-beta.2]: <https://github.com/radiantearth/stac-api-spec/tree/v1.0.0-beta.2>
