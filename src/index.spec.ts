import { SurflogFeature } from './index.d';
import { readFileSync } from 'fs';
import turfDistance from '@turf/distance';
import turfDestination from '@turf/destination';
import {
  point as turfPoint,
  lineString as turfLineString,
  featureCollection as turfFeatureCollection
} from '@turf/helpers';
import { coordEach as turfCoordEach } from '@turf/meta';
import parseGeoBuffer from './parse';
import handler from './index';
import { kmToKnots } from './index';
import assert from 'assert';

function readFile(filePath: string) {
  return parseGeoBuffer(readFileSync(filePath));
}

// fit2geo ~/Downloads/7147163106.fit > assets/test2.json

describe('GeoJSON validation', () => {

  xit('should validate distance', () => {
    const geoFile = './assets/test2.json';
    const geoJSON = readFile(geoFile);
    const { properties: { coordsMeta } } = geoJSON;
    let coordPrev = [0, 0];
    turfCoordEach(geoJSON, ([lng, lat], coordIndex) => {
      if (coordIndex > 0) {
        const { distance: distanceNow } = coordsMeta[coordIndex];
        const { distance: distancePrev } = coordsMeta[coordIndex - 1];
        const distance = distanceNow - distancePrev;
        const distanceCalc = turfDistance(coordPrev, [lng, lat]);
        const distDiff = Math.abs(distanceCalc - distance) * 1000;
        if (distDiff > 1) console.log(distDiff);
      }
      coordPrev = [lng, lat];
      // assert.ok(distance);
    });
  });

});

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

  it('should measure speed', () => {
    console.time();
    const geoFile = './assets/test.json';
    const result = handler(readFile(geoFile));
    console.timeEnd();
    console.log(result);
  });

});
