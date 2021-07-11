import { readFileSync } from 'fs';
import handler from './index';

// https://connect.garmin.com/modern/activity/6829812928

const geoFile = './assets/test.json';
const geoBuffer: ArrayBuffer = readFileSync(geoFile);

describe('GeoSpeed', () => {
  it('should measure speed', () => {
    const result = handler(geoBuffer);
    console.log(result);
  });
});
