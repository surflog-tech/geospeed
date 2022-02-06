# GeoJSON speed measure

This is build for [surflog.app](https://surflog.app/).

Given GeoJSON it will measure:

- topspeed: Fastest speed
- topspeed250: Fastest speed over 250 meter
- topspeed500: Fastest speed over 500 meter

ToDo:

- legs: Number of rides forth and back
- jibespeed: Fastest turn
- planing: Time planing in % (> 18 km/h)

It needs time, which there is not a standard way to define in [GeoJSON](https://datatracker.ietf.org/doc/html/rfc7946), thus this module expects to find time for each coordinate in `properties.coordsMeta` of a MultiLineString.
