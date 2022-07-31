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

## Extensions and Conformance

Each extension has its own conformance class, which is specified with one or more **conformance URIs**
that are defined for the extension. These must be listed in the `conformsTo` JSON of the Landing Page,
as specified by [STAC API - Core](core/), to let clients know that they can use the functionality. 

A number of extensions define functionality that could be used easily in a number of endpoints, such
as additional parameters for search through either **STAC API - Item Search** or **STAC API - Features**.

## Official Extensions

This is the list of all official extensions that are contained in the 
[stac-api-extensions](https://github.com/stac-api-extensions) GitHub organization.

| Extension Name                                                                                          | Scope*                                                                                                     | Description                                                                                                                                 | Maturity   |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| [Fields](https://github.com/stac-api-extensions/fields/blob/main/README.md)                             | [STAC API - Item Search](item-search/) request                                                             | Adds parameter to control which fields are returned in the response.                                                                        | Candidate  |
| [Filter](https://github.com/stac-api-extensions/filter/blob/main/README.md)                             | [STAC API - Item Search](item-search/) and [STAC API - Features](ogcapi-features) `/items` requests        | Adds parameter to search Item and Collection properties.                                                                                    | Pilot      |
| [Context](https://github.com/stac-api-extensions/context/blob/main/README.md)                           | [STAC API - Item Search](item-search/) response ([ItemCollection](fragments/itemcollection/README.md))     | Adds search related metadata (context) to ItemCollection.                                                                                   | Candidate  |
| [Sort](https://github.com/stac-api-extensions/sort/blob/main/README.md)                                 | [STAC API - Item Search](item-search/) request                                                             | Adds Parameter to control sorting of returns results.                                                                                       | Candidate  |
| [Transaction](https://github.com/stac-api-extensions/transaction/blob/main/README.md)                   | [STAC API - Features](ogcapi-features) POST on `/items` endpoint, DELETE/PUT on `/items/{itemId}` endpoint | Adds PUT and DELETE endpoints for the creation, editing, and deleting of Item objects.                                                      | Candidate  |
| [Items and Collections API Version](https://github.com/stac-api-extensions/version/blob/main/README.md) | [STAC API - Features](ogcapi-features) on `/items` endpoint                                                | Adds GET versions resource to Collection and Item endpoints and provides semantics for a versioning scheme for Collection and Item objects. | *Proposal* |
| [Query](https://github.com/stac-api-extensions/query/blob/main/README.md)                               | [STAC API - Item Search](item-search/) request                                                             | Adds parameter to search Item and Collection properties.                                                                                    | Candidate  |
| [Children](https://github.com/stac-api-extensions/children/blob/main/README.md)                         | [STAC API - Core](core/)                                                                                   | Defines advertisement of the children (child catalogs or child collections)                                                                 |
| a catalog contains.                                                                                     | Proposal                                                                                                   |
| [Browseable](https://github.com/stac-api-extensions/browseable/blob/main/README.md)                     | [STAC API - Core](core/)                                                                                   | Defines advertising that all Items can be accessed                                                                                          |
| by following `child` and `item` link relations.                                                         | Proposal                                                                                                   |

## Vendor Extensions

The following extensions are provided by third parties (vendors). They tackle very specific
use-cases and may be less stable than the official extensions. Once stable and adopted by multiple
parties, extensions may be made official and incorporated in the STAC repository.

Please contact a STAC maintainer or open a Pull Request to add your extension to this table.

| Name                                                                       | Scope                                          | Description                                                                                                                                  | Vendor                                         |
| -------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [Free-text Search](https://github.com/cedadev/stac-freetext-search)        | [STAC API - Item Search](item-search/) request | Adds `q` parameter and free-text search against item properties                                                                              | [CEDA, STFC, UKRI](https://github.com/cedadev) |
| [Context Collections](https://github.com/cedadev/stac-context-collections) | [STAC API - Item Search](item-search/) request | Adds a `collections` keyword to the [context](https://github.com/radiantearth/stac-api-spec/tree/main/fragments/context) extension response. | [CEDA, STFC, UKRI](https://github.com/cedadev) |

## Creating new extensions

Creating new extensions requires creating an OpenAPI fragment to define it, along with a README markdown file that gives 
an overview of the functionality. In the README, a conformance URI should be provided, so clients can use it to tell if
a service has the indicated functionality. It is also recommended to note the 'extension maturity', as defined above,
so others can know how widely it is used.

The new extension can live anywhere online, with a recommendation of using a GitHub repository to be able to track changes. 
The first step in sharing the extension is to add it to the vendor extension table above. If it is of something
that the wider community may be interested in then it should be added to the appropriate folder in the main repo as a pull 
request. 
