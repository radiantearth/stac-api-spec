# STAC API Extensions

STAC API aims to define a core of functionality, with richer capabilities enabled by extensions. The list of
STAC API Extensions is maintained at <https://stac-api-extensions.github.io>.

This document explains the process of creating and maturing an extension.

Anyone is welcome to create an extension (see [info on this](#creating-new-extensions) below), and is encouraged
to add the extension to the [official list](https://stac-api-extensions.github.io) by creating an issue or PR
on <https://github.com/stac-api-extensions/stac-api-extensions.github.io>.

All extensions must include a [maturity classification](README.md#maturity-classification), so that STAC API
specification users can easily get a sense of how much they can count on the extension.

## Extensions and Conformance

Each extension has its own conformance class, which is specified with one or more **conformance URIs**
that are defined for the extension. These must be listed in the `conformsTo` JSON of the Landing Page,
as specified by [STAC API - Core](core/), to let clients know that they can use the functionality.

A number of extensions define functionality that could be used easily in a number of endpoints, such
as additional parameters for search through either **STAC API - Item Search** or **STAC API - Features**.

## Creating new extensions

Creating new extensions requires creating an OpenAPI fragment to define it, along with a README markdown file that gives
an overview of the functionality. In the README, a conformance URI should be provided, so clients can use it to tell if
a service has the indicated functionality. It is also recommended to note the 'extension maturity', as defined above,
so others can know how widely it is used.

The new extension can live anywhere online, with a recommendation of using a GitHub repository to be able to track changes.
The first step in sharing the extension is to add it to the official list, as described above. If it is of something
that the wider community may be interested in, then it may be added to the
[stac-api-extensions](https://github.com/stac-api-extensions) GitHub organization.
