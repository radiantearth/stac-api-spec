# STAC API - Query Fragment

- **OpenAPI specification:** [openapi.yaml](openapi.yaml)
- **Extension [Maturity Classification](../../extensions.md#extension-maturity):** Pilot
  Likely to get deprecated in the future in favor of [CQL](http://docs.opengeospatial.org/DRAFTS/19-079.html).
- **Dependents:**
  - [Item Search](../../item-search)

The `query` parameter adds additional filters for searching on the properties of Items.

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
