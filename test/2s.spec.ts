import assert from 'assert';
import { randomLineString } from '@turf/random';
import turfDestination from '@turf/destination';
import { point as turfPoint, featureCollection, lineString, round as turfRound } from '@turf/helpers';
import { featureEach } from '@turf/meta';
import { Feature, LineString } from 'geojson';
import { SurflogFeatureProperty } from '../src/index.d';
import handler from '../src/index';

function makeDates(num = 6) {
  const date = new Date();
  const dates = [];
  for (let i = 0; i < num; i++) {
    dates.push(date.toISOString());
    date.setSeconds(date.getSeconds() + 1);
  }
  return dates;
}

describe('2 seconds', () => {

  it('should measure a random linestring', () => {
    const geoJSON = randomLineString(100);
    const dates = makeDates(100);
    featureEach<LineString, SurflogFeatureProperty>(geoJSON, ({ properties }, index) => {
      properties.timestamp = dates[index];
    });
    const result = handler(geoJSON);
    assert(result.properties.topspeedGPS >= result.properties.topspeedGPS2Sec);
    assert(Number(result.properties.topspeed250) >= Number(result.properties.topspeed500));
  });

  it('should measure a fixed linestring', () => {
    const distanceKM = 15 / 1000;
    const bearing = 90;
    // const pointStart = turfPoint([0, 0]); // topspeed500 != topspeed250
    const pointStart = turfPoint([12.6087385, 55.6893035]);
    const dates = makeDates(60);
    const lineStrings: Feature<LineString, SurflogFeatureProperty>[] = [];
    dates.reduce((point, timestamp) => {
      const destination = turfDestination<SurflogFeatureProperty>(point, distanceKM, bearing, { properties: { timestamp } });
      lineStrings.push(lineString([point.geometry.coordinates, destination.geometry.coordinates], { timestamp }));
      return destination;
    }, pointStart);
    const geoJSON = featureCollection(lineStrings);
    const result = handler(geoJSON);
    // console.log(result.properties);
    const precision = 8;
    assert.strictEqual(turfRound(result.properties.topspeedGPS, precision), turfRound(result.properties.topspeedGPS2Sec, precision));
    assert(result.properties.topspeedGPS >= result.properties.topspeedGPS2Sec);
    assert(Number(result.properties.topspeed250) >= Number(result.properties.topspeed500));
  });
});
