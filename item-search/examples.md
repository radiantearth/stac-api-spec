## Item Search Examples

### Single Collection example

This example shows how you can request Items from a single collection from the `search` endpoint, without having to using
OGC API - Features. It requests 100 results in `mycollection` that is in New Zealand at anytime on January 1st, 2019:

```json
{
    "collections": ["mycollection"],
    "bbox": [160.6,-55.95,-170,-25.89],
    "limit": 100,
    "datetime": "2019-01-01T00:00:00Z/2019-01-01T23:59:59Z"
}
```

```http
GET /search?collections=mycollection&bbox=160.6,-55.95,-170,-25.89&limit=100&datetime=2019-01-01T00:00:00Z/2019-01-01T23:59:59Z
```

### Paging Examples

#### Simple GET based search
Request:
```http
HTTP GET /search?bbox=-110,39.5,-105,40.5
```

Response with `200 OK`:
```json
{
    "type": "FeatureCollection",
    "features": [],
    "links": [
        {
            "rel": "next",
            "href": "http://api.cool-sat.com/search?page=2"
        }
    ]
}
```
Following the link `http://api.cool-sat.com/search?page=2` will send the user to the next page of results.

#### POST search with body and merge fields
Request to `HTTP POST /search`:
```json
{
    "bbox": [-110, 39.5, -105, 40.5]
}
```

Response with `200 OK`:
```json
{
    "type": "FeatureCollection",
    "features": [],
    "links": [
        {
            "rel": "next",
            "href": "http://api.cool-sat.com/search",
            "method": "POST",
            "body": {
                "page": 2,
                "limit": 10
            },
            "merge": true
        }
    ]
}
```

This tells the client to POST to the search endpoint using the original request with the `page` and `limit` fields 
merged in to obtain the next set of results:

Request to `POST /search`:
```json
{
    "bbox": [-110, 39.5, -105, 40.5],
    "page": 2,
    "limit": 10
}
```

This can be even more effective when using continuation tokens on the server, as the entire request body need not be 
repeated in the subsequent request:

Response with `200 OK`:
```json
{
    "rel": "next",
    "href": "http://api.cool-sat.com/search",
    "method": "POST",
    "body": {
        "next": "a9f3kfbc98e29a0da23"
    }
}
```
The above link tells the client not to merge (default of false) so it is only required to pass the next token in the body.

Request to `POST /search`:
```json
{
    "next": "a9f3kfbc98e29a0da23"
}
```

#### POST search using headers
Request to `HTTP POST /search`:
```json
{
    "bbox": [-110, 39.5, -105, 40.5],
    "page": 2,
    "limit": 10
}
```

Response with `200 OK`:
```json
{
    "type": "FeatureCollection",
    "features": [],
    "links": [
        {
            "rel": "next",
            "href": "http://api.cool-sat.com/search",
            "method": "POST",
            "headers": {
                "Search-After": "LC81530752019135LGN00"
            }
        }
    ]
}
```

This tells the client to POST to the search endpoint with the header `Search-After` to obtain the next set of results:

Request:
```http
POST /search
Search-After: LC81530752019135LGN00
```
