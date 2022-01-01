import { SurflogFeature } from './index.d';

function parseGeoBuffer(geoBuffer: ArrayBuffer): SurflogFeature {
  return JSON.parse(geoBuffer.toString()) as SurflogFeature;
}

export default parseGeoBuffer;
