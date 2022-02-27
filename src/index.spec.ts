// import assert from 'assert';
import { readFileSync } from 'fs';
import parseGeoBuffer from './parse';
import handler from './index';

function readFile(filePath: string) {
  return parseGeoBuffer(readFileSync(filePath));
}

describe('GeoSpeed', () => {

  it('should measure speed', () => {
    const geoFile = './assets/test4.json';
    const result = handler(readFile(geoFile));
    console.log(result);
  });

});
