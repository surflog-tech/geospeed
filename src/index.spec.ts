// import assert from 'assert';
import { readFileSync } from 'fs';
import parseGeoBuffer from './parse';
import handler from './index';

function readFile(filePath: string) {
  return parseGeoBuffer(readFileSync(filePath));
}

describe('GeoSpeed', () => {

  it('should measure speed', () => {
    // const geoFile = './assets/test4.json';
    // const geoFile = './assets/test5.json';
    // const geoFile = './assets/0320149c-dc7c-55bf-a7fa-c21f84faa20d.json';
    const geoFile = './assets/41e2d09d-2d6d-52c7-a39a-c03b4d1e0961.json';
    const result = handler(readFile(geoFile));
    console.log(result);
  });

});
