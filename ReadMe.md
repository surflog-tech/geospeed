# GeoJSON speed measure

This is build for [surflog.app](https://surflog.app/).

Given GeoJSON it will measure:

- topspeed: Fastest speed
- topspeed250: Fastest speed over 250 meter
- topspeed500: Fastest speed over 500 meter

ToDo:

- legs: Number of rides forth and back
- planing: Time planing in % (> 18 km/h)

For each position, a `timestamp` property is expected in order to calculate speed between each position.
