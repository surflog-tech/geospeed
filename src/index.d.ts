import { FeatureCollection, Feature, LineString } from 'geojson';

export type SurflogResult = {
  topspeed: number;
}

type SurflogGeoJsonProperties = {
  // [name: string]: any;
  coordTimes: string[];
}

export interface SurflogFeatureCollection extends FeatureCollection {
  type: "FeatureCollection";
  features: Array<Feature<LineString, SurflogGeoJsonProperties>>;
}
