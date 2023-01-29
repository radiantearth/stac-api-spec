# Implementation Recommendations

This document describes implementation recommendations for a STAC API.

## Identifiers

It is recommended that all items presented through a STAC API be part of a collection. STAC
allows items to not be contained in a collection, though this is rarely done in practice.
For each STAC Item, the Collection ID and Item ID must for a globally-unique tuple, e.g., item IDs are unique within a collection.

## CORS

Web browsers enforce a mechanism called [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) to prevent 
malicious access to APIs. It is recommended that public STAC APIs advertise a permissive [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 
configuration so browser-based UIs running on a different domain may more easily access them.

APIs should acknowledge pre-flight request headers. In general, these header values should be set on responses:

```
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

## datetime Parameter Handling

The datetime parameter used by the Item Search and Features conformance classes allows the same values as the 
[OAF datetime](http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_parameter_datetime) parameter. This allows for 
either a single [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) datetime (e.g., `1990-12-31T23:59:59Z`) 
or a closed or single open ended interval that also uses RFC 3339 datetimes (e.g., `1990-12-31T23:59:59Z/..`).

RFC 3339 is a profile of ISO 8601, adding these constraints to the allowed values:
- a complete representation of date and time (fractional seconds optional).
- requires 4-digit years
- only allows a period character to be used as the decimal point for fractional seconds
- requires the zone offset to be `Z` or like `+00:00`, while ISO8601 allows timezones like `+0000`

A simple regex for an RFC 3339 datetime is:

```regex
^(\d\d\d\d)\-(\d\d)\-(\d\d)(T|t)(\d\d):(\d\d):(\d\d)([.]\d+)?(Z|([-+])(\d\d):(\d\d))$
```

This is not a precise regex, as it matches some strings that violate semantics. There are additional restrictions, for example, 
the month (01-12), the day (01-31), the hour (0-24), minute (0-60), seconds (0-9), and timezone offsets.  However, the best 
strategy is to use this regex to ensure the datetime conforms to the RFC 3339 profile and then us an ISO8601 parser to produce
a valid datetime object from the datetime string.

Thereby, the recommended process for parsing the datetime value (which may consist of a single
RFC 3339 datetime or an interval) is:

1. uppercase the string (this avoids needing to match on both (t|T) and (z|Z))
2. split the string on `/` to determine if it is a single datetime or an interval
3. For the single value or each value of the split, check if it is either an open interval
   (the empty string or `..`), or a datetime value. Only one of the interval ends may be open.
4. Either use an RFC 3339 datetime parser like in [ciso8601](https://github.com/closeio/ciso8601), or
   match the datetime value against the RFC 3339 regex, upper case the string, and use an 
   ISO8601 parser such as [pyiso8601](https://github.com/micktwomey/pyiso8601) (Python) or
   [Luxon](https://github.com/moment/luxon/) (JavaScript). Frequently, date libraries built into
   language standard libraries do not parse ISO8601 datetimes correctly, for example, the built-in
   Python datetime library does not handle `Z` as a timezone.

Below are a few examples of valid RFC 3339 datetimes. Note the uses of fractional seconds, the use of `.` 
as the fractional seconds separator, Z (recommended) or z as a timezone, 
positive and negative arbitrary offset timezones, and T (recommended) or t as a separator between date and time. While 
the RFC 3339 spec does not define the required number of fractional seconds, STAC API only requires up to 
9 digits be supported.

- 1990-12-31T23:59:59Z (no fractional seconds, Z timezone)
- 1990-12-31T23:59:23.123Z (fractional seconds, Z timezone)
- 1996-12-19T16:39:57-08:00 (no fractional seconds, negative offset timezone)
- 1937-01-01T12:00:27.87+01:00 (fractional seconds, positive offset timezone)
- 1985-04-12t23:20:50.5202020z (lowercase t for separator, lowercase z for timezone)

These are several examples of datetime intervals:

- `/1990-12-31T23:59:59Z`
- `/1990-12-31T23:59:59Z`
- `../1990-12-31T23:59:59Z`
- `1990-12-31T23:59:59Z/`
- `1990-12-31T23:59:59Z/..`
- `1990-12-31T23:59:59Z/1991-12-31T23:59:59Z`

## Authentication Status Codes

When authentication is applied to a STAC API, it is recommended the following status codes be returned:

- 401 when no or invalid authentication information is provided
- 403 when valid authentication information is provided, but the principal does not have access (permissions)
  on the requested resource
