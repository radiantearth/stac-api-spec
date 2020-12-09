# STAC API - Fragments

This directory contains reusable OpenAPI fragments that are used by other capabilities. They tend to 
be common API components such as parameters that get mixed in to various endpoints.
They are kept in this separate fragment directory as they are not specific to any extension and are meant 
to be re-used when drafting new API extensions.

For example '[sort](sort/)' introduces a parameter (`sortby`) that can be used by both [item-search](../item-search) 
at the `/search` endpoint, and by [features](../ogcapi-features) in any of its `items` endpoints. To keep
things clean we specify a conformance class for each, so clients can know exactly what to expect. Each
conformance class is specified in the relevant folder as an 'extension' to the main capability. But their
semantics are exactly the same, so we put the shared openapi definition in this `fragments` directory.

| Fragment Name                              | Description  |
| ------------------------------------------ | ------------ |
| [Context](context/README.md)               | Adds search related metadata (context) to GeoJSON Responses. |
| [Fields](fields/README.md)                 | Adds parameter to control which fields are returned in the response. |
| [ItemCollection](itemcollection/README.md) | The specification for a set of items, e.g. returned by a search. |
| [Query](query/README.md)                   | Adds parameter to compare properties and only return the items that match. |
| [Sort](sort/README.md)                     | Adds Parameter to control sorting of returns results. | 
