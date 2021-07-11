import { readFileSync } from 'fs';
import simplify from './simplify';
import handler from './index';

// https://connect.garmin.com/modern/activity/6829812928

const geoFile = './assets/test.json';
const geoBuffer: ArrayBuffer = readFileSync(geoFile);

describe('GeoSpeed', () => {
  xit('should simplify GeoJSON', () => {
    const geoJSON = JSON.parse(geoBuffer.toString());
    console.log(JSON.stringify(simplify(geoJSON)));
  });
  it('should measure speed', () => {
    const result = handler(geoBuffer);
    console.log(result);
  });
});
