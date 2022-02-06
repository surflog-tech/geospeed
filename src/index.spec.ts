// import assert from 'assert';
// import { SurflogFeature } from './index.d';
import { readFileSync, writeFileSync } from 'fs';
import turfDistance from '@turf/distance';
// import turfDestination from '@turf/destination';
// import {
//   point as turfPoint,
//   lineString as turfLineString,
//   featureCollection as turfFeatureCollection
// } from '@turf/helpers';
import { coordEach as turfCoordEach, coordAll as turfCoordAll } from '@turf/meta';
import turfBearing from '@turf/bearing';
import parseGeoBuffer from './parse';
import handler from './index';
// import { kmToKnots } from './index';

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
        const { distance: distanceNow } = coordsMeta[coordIndex];
        const { distance: distancePrev } = coordsMeta[coordIndex - 1];
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

  // xit('should measure 1km', () => {
  //   const decimals = 10;
  //   const start = [-73.97665500640869, 40.778307278822645];
  //   const { geometry: { coordinates: destination } } = turfDestination(turfPoint(start), 1, 0);
  //   const lineString = turfLineString([start, destination]);
  //   lineString.properties = {
  //     coordTimes: ['2021-08-08T06:00:00.000Z', '2021-08-08T07:00:00.000Z']
  //   };
  //   const featureCollection = turfFeatureCollection([lineString]);
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   const geoData: SurflogFeature = JSON.parse(JSON.stringify(featureCollection));
  //   const { topspeed } = handler(geoData);
  //   assert.strictEqual(topspeed.toFixed(decimals), (1 / kmToKnots).toFixed(decimals));
  // });

  it('should measure speed', () => {
    console.time();
    const geoFile = './assets/test3.json';
    const result = handler(readFile(geoFile));
    console.timeEnd();
    console.log(result);
  });

  xit('create jibe', () => {
    const geoFile = './assets/8c88332c-ff17-5a24-b3f1-ef1cde0cc4e7.json';
    const indexStart = 2414;
    const indexEnd = 2435;
    const geoJSON = readFile(geoFile);
    const { properties: { coordsMeta } } = geoJSON;
    const coordinates = turfCoordAll(geoJSON);
    coordinates.splice(0, indexStart);
    coordinates.splice(indexEnd - indexStart);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    geoJSON.geometry.coordinates = coordinates;
    coordsMeta.splice(0, indexStart);
    coordsMeta.splice(indexEnd - indexStart);
    writeFileSync('./assets/jibe.json', JSON.stringify(geoJSON));
    console.log(geoJSON);
    // turfCoordEach(geoJSON, ([lng, lat], coordIndex) => {
    //   const meta = coordsMeta[coordIndex];
    //   if (meta.timestamp === '2021-08-19T14:31:40.000Z') console.log(coordIndex);
    //   if (meta.timestamp === '2021-08-19T14:31:51.000Z') console.log(coordIndex);
    // });
  });

});

describe('GeoJSON jibe', () => {

  it('should measure jibe', () => {
    const lookback = 5;
    const bearingIsJibe = 45;
    const geoFile = './assets/jibe.json';
    // const geoFile = './assets/test3.json';
    const geoJSON = readFile(geoFile);
    let coordPrev = [0, 0];
    let distSum = 0;
    const log: {
      bearing: number;
      bearingSum: number;
      bearingAverage: number;
      distSum: number;
    }[] = [];
    let bearingSum = 0;
    turfCoordEach(geoJSON, ([lng, lat], coordIndex) => {
      if (coordIndex > 0) {
        const bearing = Math.round(turfBearing(coordPrev, [lng, lat]));
        bearingSum += bearing;
        const bearingAverage = Math.round(bearingSum / coordIndex);
        // console.log(bearing);
        const distance = turfDistance(coordPrev, [lng, lat]);
        distSum += distance * 1000;
        // console.log(distanceCalc);
        if (coordIndex >= lookback) {
          const bearingLookback = log[coordIndex - lookback].bearing;
          const bearingDiff = Math.abs(bearingLookback - bearing);
          if (bearingDiff > bearingIsJibe) console.log({ bearingDiff, coordIndex });
          // console.log({ bearingLookback, bearing, bearingDiff });
        }
        log.push({ bearing, bearingSum, bearingAverage, distSum });
      }
      coordPrev = [lng, lat];
    });
    // console.log(log);
  });

});
