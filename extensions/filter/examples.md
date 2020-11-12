# CQL Examples for STAC

CQL is a very rich query language, and there are not a lot of great references online that show it in action. So
this page aims to show how it works, particularly with STAC Items. We'll use a satellite imagery example, and show
queries in both `cql-text` and `cql-json`. 

We'll be imagining these as queries against [EarthSearch Sentinel 2 
COG](https://stacindex.org/catalogs/earth-search#/Cnz1sryATwWudkxyZekxWx6356v9RmvvCcLLw79uHWJUDvt2?t=items)' data.
A sample STAC Item (leaving off all the asset info) is: 

```json
{
	"type": "Feature",
	"stac_version": "1.0.0-beta.2",
	"stac_extensions": [
		"eo",
		"view",
		"proj"
	],
	"id": "S2A_60HWB_20201111_0_L2A",
	"bbox": [ 176.9997779369264, -39.83783732066656, 178.14624317719924, -38.842842449352425],
	"geometry": {
		"type": "Polygon",
		"coordinates": [[[176.9997779369264, -39.83783732066656],[176.99978104582647,-38.84846679951431],
						[178.14624317719924, -38.842842449352425],[177.8514661209684,-39.83471270154608],
						[176.9997779369264, -39.83783732066656]]]
	},
	"properties": {
		"datetime": "2020-11-11T22:16:58Z",
		"platform": "sentinel-2a",
		"constellation": "sentinel-2",
		"instruments": ["msi"],
		"gsd": 10,
		"view:off_nadir": 0,
		"proj:epsg": 32760,
		"sentinel:utm_zone": 60,
		"sentinel:latitude_band": "H",
		"sentinel:grid_square": "WB",
		"sentinel:sequence": "0",
		"sentinel:product_id": "S2A_MSIL2A_20201111T221611_N0214_R129_T60HWB_20201111T235959",
		"sentinel:data_coverage": 78.49,
		"eo:cloud_cover": 0.85,
		"sentinel:valid_cloud_cover": true,
		"created": "2020-11-12T02:08:31.563Z",
		"updated": "2020-11-12T02:08:31.563Z"
},
```

## Core CQL

The following examples all are supported with the core CQL conformance class. 

### Logical

Show me all imagery that has low cloud cover (less than 10), and high data coverage (50), as I'd like a cloud free image that is not just 
a tiny sliver of data.

#### AND cql-text (GET)

```http
/search?filter=sentinel:data_coverage > 50 AND eo:cloud_cover < 10 
```

#### AND cql-json (POST)

```json
{
  "filter": {
    "and": [
            {
               "gt": {
                  "property": "sentinel:data_coverage",
                  "value": 50
               }
            },
            {
               "lt": {
                  "property": "eo:cloud_cover",
                  "value": 10
               }
            }
           ]
    }
}
```

An 'or' is also supported, matching if either condition is true. Though it's not a sensible query you could get images that have full data 
coverage or low cloud cover.

#### OR cql-text (GET)

```http
/search?filter=sentinel:data_coverage > 50 OR eo:cloud_cover < 10 
```

#### OR cql-json (POST)

```json
{
  "filter": {
    "or": [
            {
               "gt": {
                  "property": "sentinel:data_coverage",
                  "value": 50
               }
            },
            {
               "lt": {
                  "property": "eo:cloud_cover",
                  "value": 10
               }
            }
           ]
    }
}
```

### Temporal

The temporal support in required core is pretty minimal, with just `ANYINTERACT`

#### ANYINTERACT cql-text (GET)

```http
/search?filter=datetime ANYINTERACT 2020-11-11
```

#### ANYINTERACT cql-json (POST)

```json
{
  "filter": {
    "or": [
            {
               "gt": {
                  "property": "sentinel:data_coverage",
                  "value": 50
               }
            },
            {
               "lt": {
                  "property": "eo:cloud_cover",
                  "value": 10
               }
            }
           ]
    }
}
```

### Geometry

Similarly in core there is only one geometry operator - `INTERSECTS`

#### INTERSECTS cql-text (GET)

```http
/search?filter=INTERSECTS(geometry,POLYGON((-77.0824 38.7886,-77.0189 38.7886,-77.0189 38.8351,-77.0824 38.8351,-77.0824 38.7886)))
```

#### INTERSECTS cql-json (POST)

```json
{
    "filter": {
        "intersects": {
                "property": "geometry",
                "value": {
                   "type": "Polygon",
                   "coordinates": [[
                        [-77.0824, 38.7886], [-77.0189, 38.7886],
                        [-77.0189, 38.8351], [-77.0824, 38.8351],
                        [-77.0824, 38.7886]
                    ]]
                }
        }
    },        
}
```
