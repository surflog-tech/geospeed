import { SurflogFeature } from './index.d';
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

function parseGeoBuffer(geoBuffer: ArrayBuffer): SurflogFeature {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(geoBuffer.toString());
}

describe('GeoSpeed', () => {

  xit('should measure 1km', () => {
    const decimals = 10;
    const start = [-73.97665500640869, 40.778307278822645];
    const { geometry: { coordinates: destination } } = turfDestination(turfPoint(start), 1, 0);
    const lineString = turfLineString([start, destination]);
    lineString.properties = {
      coordTimes: ['2021-08-08T06:00:00.000Z', '2021-08-08T07:00:00.000Z']
    };
    const featureCollection = turfFeatureCollection([lineString]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const geoData: SurflogFeature = JSON.parse(JSON.stringify(featureCollection));
    const { topspeed } = handler(geoData);
    assert.strictEqual(topspeed.toFixed(decimals), (1 / kmToKnots).toFixed(decimals));
  });

  xit('should measure speed', () => {
    const geoFile = './assets/test.json';
    const geoBuffer: ArrayBuffer = readFileSync(geoFile);
    const result = handler(parseGeoBuffer(geoBuffer));
    console.log(result);
  });

  it('should measure speed', function() {
    // this.timeout(20000);
    const geoFile = './assets/test.json';
    const geoBuffer: ArrayBuffer = readFileSync(geoFile);
    const result = handler(parseGeoBuffer(geoBuffer));
    console.log(result);
  });

});
