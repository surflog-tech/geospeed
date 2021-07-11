import { readFileSync } from 'fs';
import handler from './index';

const geoFile = './assets/test.json';
const geoBuffer: ArrayBuffer = readFileSync(geoFile);

describe('GeoSpeed', () => {
  it('should measure speed', () => {
    const result = handler(geoBuffer);
    console.log(result);
  });
});
