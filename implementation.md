# Implementation Recommendations

This document describes implementation recommendations for a STAC API.

## CORS

Web browsers enforce a mechanism called [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) to prevent 
malicious access to APIs. It is recommended that public STAC APIs advertise a permissive [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 
configuration so browser-based UIs running on a different domain may more easily access them.

APIs should acknowledge pre-flight request headers. In general, these header values should be set on responses:

```http
access-control-allow-origin: *
access-control-allow-methods: OPTIONS, POST, GET
access-control-allow-headers: Content-Type
```

It is relatively safe to use these headers for all endpoints. However, one may want to restrict the methods to 
only those that apply to each endpoint. For example, the `/collection/{collectionId}/items` endpoint should 
only allow OPTIONS and GET, since POST is only used by the Transactions Extension, which presumably would 
require authentication as it is mutating data. 

Implementations that support the Transactions Extension or require credentials for some operations will need to 
implement different behavior, for example, allowing credentials when requests are coming from a trusted domain, 
allowing DELETE, PUT, or PATCH methods, or 
permitting the `If-Match` request header.
