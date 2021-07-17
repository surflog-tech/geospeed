import { readFileSync } from 'fs';
import turfDestination from '@turf/destination';
import {
  point as turfPoint,
  lineString as turfLineString,
  featureCollection as turfFeatureCollection
} from '@turf/helpers';
import handler from './index';
import { kmToKnots } from './index';
import assert from 'assert/strict';

describe('GeoSpeed', () => {

  it('should measure 1km', () => {
    const decimals = 10;
    const start = [-73.97665500640869, 40.778307278822645];
    const { geometry: { coordinates: destination } } = turfDestination(turfPoint(start), 1, 0);
    const lineString = turfLineString([start, destination]);
    lineString.properties = {
      coordTimes: ['2021-08-08T06:00:00.000Z', '2021-08-08T07:00:00.000Z']
    };
    const featureCollection = turfFeatureCollection([lineString]);
    const buffer = Buffer.from(JSON.stringify(featureCollection));
    const { topspeed } = handler(buffer);
    assert.strictEqual(topspeed.toFixed(decimals), (1 / kmToKnots).toFixed(decimals));
  });

  it('should measure speed', () => {
    const geoFile = './assets/test.json';
    const geoBuffer: ArrayBuffer = readFileSync(geoFile);
    const result = handler(geoBuffer);
    console.log(result);
  });

});
