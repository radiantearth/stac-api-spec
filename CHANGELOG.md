# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed
- Context Extension OpenAPI spec was updated to remove the no longer used `next` attribute
- Added root endpoint Link `search` must have `type` of `application/geo+json`
- Corrected the description of endpoint `/collections` to say it returns an object per OAFeat, instead of an array of Collection
- Updated transaction extension so it aligns with OGC API - Features Part 4: Simple Transactions

### Deprecated

### Removed

### Fixed

## Older versions

See the [stac-spec CHANGELOG](https://github.com/radiantearth/stac-spec/blob/v0.9.0/CHANGELOG.md) for STAC API releases prior to or equal to version 0.9.0.


[Unreleased]: <https://github.com/radiantearth/stac-api-spec/compare/master...dev>
