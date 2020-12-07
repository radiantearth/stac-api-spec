# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased][]

### Added
- The landing page returns the conformance classes in a property `conformsTo`, which mirrors `GET /conformances` from OGC APIs.

### Changed
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
