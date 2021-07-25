import { SurflogFeature } from './index.d';

function parseGeoBuffer(geoBuffer: ArrayBuffer): SurflogFeature {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(geoBuffer.toString());
}

export default parseGeoBuffer;
