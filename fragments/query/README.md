# STAC API - Query Fragment

- **OpenAPI specification:** [openapi.yaml](openapi.yaml)
- **Conformance Class:** <https://api.stacspec.org/v1.0.0-beta.5/item-search#query>
- **Extension [Maturity Classification](../../README.md#maturity-classification):** Pilot
- **Dependents:**
  - [Item Search](../../item-search)

The `query` parameter adds additional filters for searching on the properties of Item objects. The JSON syntax for
these filters is known as "STACQL" (pronounced `stack-cue-el`).

The syntax for the `query` filter is:

```js
{
  "query": {
    "<property_name>": {
      "<operator>": <value>
    }
  }
}
```

Each property to search is an entry in the `query` filter. `<operator>` can be one of: `eq`, `neq`, `lt`, `lte`, `gt`, `gte`, `startsWith`, `endsWith`, `contains`, `in`. 
Multiple operators may be provided for each property and are treated as a logical AND, where all conditions must be met.

## Examples

Find scenes with cloud cover between 0 and 10%:

```json
{
  "query": {
    "eo:cloud_cover": {
      "gte": 0,
      "lte": 10
    },
    "stringAttr1": {
      "startsWith": "abc",
      "endsWith": "xyz"
    },
    "stringAttr2": {
      "contains": "mnop"
    },
    "stringAttr3": {
      "in": ["landsat", "modis", "naip"]
    }
  }
}
```
