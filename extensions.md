# API Extensions

STAC API aims to define a core of functionality, with richer capabilities enabled by extensions. This document
lists the existing extensions, and explains the process of creating and maturing an extension. 

Anyone is welcome to create an extension (see [info on this](#creating-new-extensions) below), and is encouraged to at least 
link to the extension from here.
The third-party / vendor extension section is for the sharing of extensions. As third parties create useful extensions for their implementation
it is expected that others will make use of it, and then evolve to make it a 'community extension', that several providers maintain together.
For now anyone from the community is welcome to use the appropriate parts of the stac-api-spec repository to collaborate.

All extensions must include a [maturity classification](README.md#maturity-classification), so that STAC API
specification users can easily get a sense of how much they can count on the extension. 

## Extensions, Fragments, and Conformance

Each extension has its own conformance class, which is specified with a 'conformance URI' that is defined for the extension, and listed in 
the table below. These must be listed in the `conformsTo` JSON of the landing page, as specified by [STAC API Core](core/), to let clients
know that they can utilize the functionality. 

Each extension is defined to work against only one of the main API spec's conformance classes. A number of extensions define functionality 
that could be used easily in a number of endpoints, such as additional parameters for search. For this repository we put those in the 
[fragments](fragments/) directory. The main definition of the functionality lives there, but a fragment does not define a conformance class.
Only extensions have conformance classes, as they define the functionality along with the scope - where it is used. 

**NOTE**: *Currently the fragments are only used in item-search, but in the next release we will define extensions for all the fragments that
are scoped against ogcapi-features*.

## List of community extensions

This is the list of all extensions that are contained in the stac-api-spec repository.

| Extension Name                                                                    | Scope*                                                                                                     | Description                                                                                                                                 | Maturity   |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| [Fields](item-search/README.md#fields-extension)                                  | [Item Search](item-search/) request                                                                        | Adds parameter to control which fields are returned in the response.                                                                        | *Pilot*    |
| [Filter](item-search/README.md#filter-extension)                                  | [Item Search](item-search/) and [STAC API - Features](ogcapi-features) `/items` requests                   | Adds parameter to search Item and Collection properties.                                                                                    | *Pilot*    |
| [Context](item-search/README.md#context-extension)                                | [Item Search](item-search/) response ([ItemCollection](fragments/itemcollection/README.md))                | Adds search related metadata (context) to ItemCollection.                                                                                   | *Proposal* |
| [Sort](item-search/README.md#sort-extension)                                      | [Item Search](item-search/) request                                                                        | Adds Parameter to control sorting of returns results.                                                                                       | *Pilot*    |
| [Transaction](ogcapi-features/extensions/transaction/README.md)                   | [STAC API - Features](ogcapi-features) POST on `/items` endpoint, DELETE/PUT on `/items/{itemId}` endpoint | Adds PUT and DELETE endpoints for the creation, editing, and deleting of Item objects.                                                      | *Pilot*    |
| [Items and Collections API Version](ogcapi-features/extensions/version/README.md) | [STAC API - Features](ogcapi-features) on `/items` endpoint                                                | Adds GET versions resource to Collection and Item endpoints and provides semantics for a versioning scheme for Collection and Item objects. | *Proposal* |
| [Query](item-search/README.md#query-extension)                                    | [Item Search](item-search/) request                                                                        | Adds parameter to search Item and Collection properties.                                                                                    | *Pilot*    |

### Conformance classes of extensions

Each extension has its own conformance URI, which is used in the `conformsTo` response of the landing page to let clients know what capabilities 
the service supports. This are listed at the top of each extension description, but the full table is given here for ease of reference.

- [Fields](item-search/README.md#fields-extension)
  - <https://api.stacspec.org/v1.0.0-beta.5/item-search#fields-extension>
  - <https://api.stacspec.org/v1.0.0-beta.5/ogcapi-features#fields-extension>
- [Filter](item-search/README.md#filter-extension)
  - <https://api.stacspec.org/v1.0.0-beta.5/item-search#filter>
  - <http://www.opengis.net/spec/ogcapi-features-3/1.0/conf/filter>
  - <http://www.opengis.net/spec/ogcapi-features-3/1.0/conf/features-filter>
  - <http://www.opengis.net/spec/cql2/1.0/conf/cql2-text>
  - <http://www.opengis.net/spec/cql2/1.0/conf/cql2-json>
  - <http://www.opengis.net/spec/cql2/1.0/conf/basic-cql2>
  - <http://www.opengis.net/spec/cql2/1.0/conf/advanced-comparison-operators>
  - <http://www.opengis.net/spec/cql2/1.0/conf/basic-spatial-operators>
  - <http://www.opengis.net/spec/cql2/1.0/conf/spatial-operators>
  - <http://www.opengis.net/spec/cql2/1.0/conf/temporal-operators>
  - <http://www.opengis.net/spec/cql2/1.0/conf/functions>
  - <http://www.opengis.net/spec/cql2/1.0/conf/arithmetic>
  - <http://www.opengis.net/spec/cql2/1.0/conf/array-operators>
  - <http://www.opengis.net/spec/cql2/1.0/conf/property-property>
  - <http://www.opengis.net/spec/cql2/1.0/conf/accent-case-insensitive-comparison>
- [Context](item-search/README.md#context-extension)
  - <https://api.stacspec.org/v1.0.0-beta.5/item-search#context>
  - <https://api.stacspec.org/v1.0.0-beta.5/ogcapi-features#context>
- [Sort](item-search/README.md#sort-extension)
  - <https://api.stacspec.org/v1.0.0-beta.5/item-search#sort>
  - <https://api.stacspec.org/v1.0.0-beta.5/ogcapi-features#sort>
- [Transaction](ogcapi-features/extensions/transaction/README.md)
  - <https://api.stacspec.org/v1.0.0-beta.5/ogcapi-features/extensions/transaction>
- [Items and Collections API Version](ogcapi-features/extensions/version/README.md)
  - <https://api.stacspec.org/v1.0.0-beta.5/ogcapi-features/extensions/version>
- [Query](item-search/README.md#query-extension)
  - <https://api.stacspec.org/v1.0.0-beta.5/item-search#query>

## Third-party / vendor extensions

The following extensions are provided by third parties (vendors). They tackle very specific
use-cases and may be less stable than the official extensions. Once stable and adopted by multiple
parties, extensions may be made official and incorporated in the STAC repository.

Please contact a STAC maintainer or open a Pull Request to add your extension to this table.

| Name                                                                       | Scope                               | Description                                                                                                                                    | Vendor                                         |
| -------------------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [Free-text Search](https://github.com/cedadev/stac-freetext-search)        | [Item Search](item-search/) request | Adds `q` parameter and free-text search against item properties                                                                                | [CEDA, STFC, UKRI](https://github.com/cedadev) |
| [Context Collections](https://github.com/cedadev/stac-context-collections) | [Item Search](item-search/) request | Adds a `collections` keyword to the [context](https://github.com/radiantearth/stac-api-spec/tree/master/fragments/context) extension response. | [CEDA, STFC, UKRI](https://github.com/cedadev) |

## Creating new extensions

Creating new extensions requires creating an OpenAPI fragment to define it, along with a README markdown file that gives 
an overview of the functionality. In the README, a conformance URI should be provided, so clients can use it to tell if
a service has the indicated functionality. It is also recommended to note the 'extension maturity', as defined above,
so others can know how widely it is used.

The new extension can live anywhere online, with a recommendation of using a GitHub repository to be able to track changes. 
The first step in sharing the extension is to add it to the third-party / vendor extension table above. If it is of something
that the wider community may be interested in then it should be added to the appropriate folder in the main repo as a pull 
request. 
