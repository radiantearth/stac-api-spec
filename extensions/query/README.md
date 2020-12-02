# STAC API - Query Extension

- **Conformance URI: <http://stacspec.org/spec/api/1.0.0-beta.1/extensions/query>**
- **Extension [Maturity Classification](../README.md#extension-maturity): Pilot** - likely to be deprecated in the future in favor of CQL.
- **Dependencies**: [STAC API - Search](../item-search/)

The STAC search endpoint, `/search`, by default only accepts a limited set of core filter parameters.
The Query API extension adds additional filters for searching on the properties of Items.

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
