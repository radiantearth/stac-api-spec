<img src="https://github.com/radiantearth/stac-site/raw/master/images/logo/stac-030-long.png" alt="stac-logo" width="700"/>

# STAC API

## About

The SpatioTemporal Asset Catalog (STAC) specification aims to standardize the way geospatial assets are exposed online and queried. 
A 'spatiotemporal asset' is any file that represents information about the earth captured in a certain space and 
time. The core STAC specification lives at [gitub.com/radiantearth/stac-spec](https://github.com/radiantearth/stac-spec).

A STAC API is the dynamic version of a SpatioTemporal Asset Catalog. It returns a STAC [Catalog](./stac-spec/catalog-spec/catalog-spec.md), 
[Collection](./stac-spec/collection-spec/collection-spec.md), [Item](./stac-spec/item-spec/item-spec.md), 
or [ItemCollection](./stac-spec/item-spec/itemcollection-spec.md), depending on the endpoint.
Catalogs and Collections are JSON, while Items and ItemCollections are GeoJSON-compliant entities with foreign members.  
Typically, a Feature is used when returning a single Item, and FeatureCollection when multiple Items (rather than a JSON array of Item entities).

The API is compliant with the *[OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html)* standard 
(formerly known as *OGC Web Feature Service 3*), in that it defines many of the endpoints that STAC uses. A STAC API should be 
compatible and usable with any OGC API - Features clients. The STAC API can be thought of as a specialized Features API 
to search STAC Catalogs, where the features returned are STAC [Items](./stac-spec/item-spec/item-spec.md), 
that have common properties, links to their assets and geometries that represent the footprints of the geospatial assets.

## WARNING

This specification is approaching maturity, but will likely have some minor changes as we approach the 1.0-beta release and 
fully align with [OGC API - Features](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html). This repo was also recently 
split off from the main [stac-spec repository](https://github.com/radiantearth/stac-spec). Not all links and references have 
been updated yet so should be considered a work in progress. To implement against a stable STAC API we recommend using 
[STAC API Version 0.9.0](https://github.com/radiantearth/stac-spec/tree/v0.9.0/api-spec). This master branch will be 
considered to be under active development until we release version 1.0-beta, at which time it will be stable, and a `dev` 
branch will be created for active development.

## Communication

For any questions feel free to jump on our [gitter channel](https://gitter.im/SpatioTemporal-Asset-Catalog/Lobby) or email 
our [google group](https://groups.google.com/forum/#!forum/stac-spec). The majority of communication about the evolution of 
the specification takes place in the [issue tracker](https://github.com/radiantearth/stac-api-spec/issues) and in 
[pull requests](https://github.com/radiantearth/stac-api-spec/pulls).

## In this repository

**The Specification:** The main description of the STAC API specification is in the *[api-spec.md](api-spec.md)* file.
It includes an overview and in depth explanation of the REST endpoints and parameters.

**Extensions:** API Extensions are given in the *[extensions](extensions/)* folder.
YAML fragments are provided for each extension with details provided in the *[README](extensions/README.md)*.

**Examples:** For samples of how the STAC API can be queried, see the *[examples.md](examples.md)* file.

**API Definitions:** The API is described by the OpenAPI documents in the *[openapi](openapi/)* folder.
Human-readable versions of the OpenAPI definitions can be viewed online for the last release:
- [Only the core STAC API](https://stacspec.org/STAC-api.html) 
- [STAC API including all extensions](https://stacspec.org/STAC-ext-api.html)

## OpenAPI definitions

The definitive specification for STAC API is provided as an [OpenAPI](http://openapis.org/) 3.0 specification that is
contained within several YAML files in the [openapi](openapi/) and [extensions](extensions/) directories.

These are built into the definitive core API specification at [STAC.yaml](STAC.yaml), which can be viewed online at 
[https://stacspec.org/STAC-api.html](https://stacspec.org/STAC-api.html). An additional OpenAPI definition is provided at 
[STAC-extensions.yaml](STAC-extensions.yaml) that includes all the optional extensions, and can be browsed online at
[https://stacspec.org/STAC-ext-api.html](https://stacspec.org/STAC-ext-api.html).

In the [openapi](openapi/) directory there are three files

- OAFeat.yaml - The OAFeat.yaml file is the OGC API - Features OpenAPI definition as currently used by STAC API.
- STAC.yaml - Contains (1) additional STAC-specific endpoints that STAC APIs expose and (2) extensions and concretization to
  OGC API - Features that STAC APIs require.
- STAC.merge.yaml - A file referencing the above two used to create the final [STAC.yaml](STAC.yaml) definition.

A basic STAC implementation implements both the OGC API - Features and STAC definitions.

The YAML files in the [extensions](extensions/) folder are fragments. Fragments are used to describe incomplete pieces of an OpenAPI document,
and must be merged with a complete OpenAPI document to be usable. This way extensions can be kept separate, and implementors can combine just
the extensions they want to use in order to create a custom OpenAPI document they can use.

Editing should be done on the files in the [openapi](openapi/) and [extensions](extensions/) directories, *not* the `STAC.yaml` and
`STAC-extensions.yaml` files, as these are automatically generated. If any of the files are edited, update the OpenAPI docs to overwrite the files:

```bash
npm install
npm run generate-all
```

You can also dynamically serve a human-readable version of your edited files at `http://127.0.0.1:8080` using the following commands:
- Only the core STAC API:
  ```bash
  npm install
  npm run serve
  ```
- The STAC API including all extensions:
  ```bash
  npm install
  npm run serve-ext
  ```

Create your own OpenAPI document by combining the STAC definition with the extensions you want by creating a `myapi.merge.yaml` file.
This file should contain a line indicating the files that need to be merged:

```yaml
!!files_merge_append ["STAC.yaml", "extensions/query/query.fragment.yaml"]
```

Then, run the [yaml-files](https://www.npmjs.com/package/yaml-files) command line tool:

```bash
npm -g install
yaml-files myapi.merge.yaml myapi.yaml
```

The commands above require root/administrator level access to install the npm packages globally.
If you do not have the required permissions or do not want to install the packages globally for any other reason check the
npm documentation for your platform for instructions to install and run local packages. Unix bash users for instance may use:

```bash
npm install
$(npm bin)/yaml-files myapi.merge.yaml myapi.yaml
```

## API Evolution

The STAC API is still a work in progress. It currently tries to adhere to the OGC API - Features (OAFeat) specification,
with some STAC specific extensions. The OAFeat portion of the API is provided in the *[OAFeat.yaml](openapi/OAFeat.yaml)*
and represents the version of OAFeat that is currently being used by STAC. It may diverge some with the
*[OAFeat](https://github.com/opengeospatial/ogcapi-features)* spec at any given time, either out of date or 'ahead',
with proposals to align OAFeat. The long term goal is for STAC's API and OAFeat to completely align,
ideally all of STAC API is made from OAFeat plus its extension ecosystem, and STAC just focuses on the content.
But until then STAC will work to bring practical implementation experience to OAFeat. 

## Contributing

Anyone building software that catalogs imagery or other geospatial assets is welcome to collaborate.
Beforehand, please review our [guidelines for contributions](CONTRIBUTING.md).
