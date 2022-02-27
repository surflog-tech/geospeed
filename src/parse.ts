import { FeatureCollection, LineString } from 'geojson';
import { SurflogFeatureProperty } from './index.d';

function parseGeoBuffer(geoBuffer: ArrayBuffer) {
  return JSON.parse(geoBuffer.toString()) as FeatureCollection<LineString, SurflogFeatureProperty>;
}

export default parseGeoBuffer;
