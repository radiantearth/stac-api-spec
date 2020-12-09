# API Extensions

STAC aims to define a small core of functionality, with richer capabilities enabled by extensions. This document
lists the existing extensions, and explains the process of creating and maturing an extension. 

Anyone is welcome to create an extension (see [info on this](#creating-new-extensions) below), and is encouraged to at least 
link to the extension from here.
The third-party / vendor extension section is for the sharing of extensions. As third parties create useful extensions for their implementation
it is expected that others will make use of it, and then evolve to make it a 'community extension', that several providers maintain together.
For now anyone from the community is welcome to use the appropriate parts of the stac-api-spec repository to collaborate.

## Extension Maturity

Extensions are meant to evolve to maturity, and thus may be in different states
in terms of stability and number of implementations. All extensions included must include a 
maturity classification, so that STAC spec users can easily get a sense of how much they can count
on the extension. 

| Maturity Classification |  Min Impl # | Description | Stability |
| ----------------------- | ----------- | ----------- | --------- |
| Proposal                | 0           | An idea put forward by a community member to gather feedback | Not stable - breaking changes almost guaranteed as implementers try out the idea. |
| Pilot                   | 1           | Idea is fleshed out, with examples and a JSON schema, and implemented in one or more catalogs. Additional implementations encouraged to help give feedback | Approaching stability - breaking changes are not anticipated but can easily come from additional feedback |
| Candidate               | 3           | A number of implementers are using it and are standing behind it as a solid extension. Can generally count on an extension at this maturity level | Mostly stable, breaking changes require a new version and minor changes are unlikely. |
| Stable                  | 6           | Highest current level of maturity. The community of extension maintainers commits to a STAC review process for any changes, which are not made lightly. | Completely stable, all changes require a new version number and review process. |
| Deprecated              | N/A         | A previous extension that has likely been superceded by a newer one or did not work out for some reason. | DO NOT USE, is not supported |

Maturity mostly comes through diverse implementations, so the minimum number of implementations
column is the main gating function for an extension to mature. But extension authors can also
choose to hold back the maturity advancement if they don't feel they are yet ready to commit to
the less breaking changes of the next level.

A 'mature' classification level will likely be added once there are extensions that have been 
stable for over a year and are used in twenty or more implementations.

## Extensions, Fragments and Conformance

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

| Extension Name                                                                    | Scope*                                                                                                     | Description                                                                                                                             | Maturity   |
|-----------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|------------|
| [Fields](item-search/README.md#fields)                                            | [Item Search](item-search/) request                                                                        | Adds parameter to control which fields are returned in the response.                                                                    | *Pilot*    |
| [Query](item-search/README.md#query)                                              | [Item Search](item-search/) request                                                                        | Adds parameter to search Item and Collection properties.                                                                                | *Pilot*    |
| [Context](item-search/README.md#context)                                          | [Item Search](item-search/) response ([ItemCollection](fragments/itemcollection/README.md))                       | Adds search related metadata (context) to ItemCollection.                                                                               | *Proposal* |
| [Sort](item-search/README.md#sort)                                                | [Item Search](item-search/) request                                                                        | Adds Parameter to control sorting of returns results.                                                                                   | *Pilot*    |
| [Transaction](ogcapi-features/extensions/transaction/README.md)                   | [STAC - Features API](ogcapi-features) POST on `/items` endpoint, DELETE/PUT on `/items/{itemId}` endpoint | Adds PUT and DELETE endpoints for the creation, editing, and deleting of items and Collections.                                         | *Pilot*    |
| [Items and Collections API Version](ogcapi-features/extensions/version/README.md) | [STAC - Features API](ogcapi-features) on `/items` endpoint                                                | Adds GET versions resource to collections and items endpoints and provides semantics for a versioning scheme for collections and items. | *Proposal* |

### Conformance classes of extensions

Each extension has its own conformance URI, which is used in the `conformsTo` response of the landing page to let clients know what capabilities 
the service supports. This are listed at the top of each extension description, but the full table is given here for ease of reference.

| Extension Name                                                                    | Conformance URI                                                            |
|-----------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| [Fields](item-search/README.md#fields)                                            | <https://api.stacspec.org/v1.0.0-beta.1/item-search#fields>  |
| [Query](item-search/README.md#query)                                              | <https://api.stacspec.org/v1.0.0-beta.1/item-search#query>   |
| [Context](item-search/README.md#context)                                          | <https://api.stacspec.org/v1.0.0-beta.1/item-search#context> |
| [Sort](item-search/README.md#sort)                                                | <https://api.stacspec.org/v1.0.0-beta.1/item-search#sort>    |
| [Transaction](ogcapi-features/extensions/transaction/README.md)                   | <https://api.stacspec.org/v1.0.0-beta.1/ogcapi-features/extensions/transaction>         |
| [Items and Collections API Version](ogcapi-features/extensions/version/README.md) | <https://api.stacspec.org/v1.0.0-beta.1/ogcapi-features/extensions/version>             |

## Third-party / vendor extensions

The following extensions are provided by third parties (vendors). They tackle very specific
use-cases and may be less stable than the official extensions. Once stable and adopted by multiple
parties, extensions may be made official and incorporated in the STAC repository.

Please contact a STAC maintainer or open a Pull Request to add your extension to this table.

| Name     | Scope | Description | Vendor |
| -------- | ----- | ----------- | ------ |
| None yet |       |             |        |

## Creating new extensions

Creating new extensions requires creating an OpenAPI fragment to define it, along with a README markdown file that gives 
an overview of the functionality. In the README a conformance URI should be provided, so clients can use it to tell if
a service has the indicated functionality. It is also recommended to note the 'extension maturity', as defined above,
so others can know how widely it is used.

The new extension can live anywhere online, with a recommendation of using a GitHub repository to be able to track changes. 
The first step in sharing the extension is to add it to the third-party / vendor extension table above. If it is of something
that the wider community may be interested in then it should be added to the appropriate folder in the main repo as a pull 
request. 
