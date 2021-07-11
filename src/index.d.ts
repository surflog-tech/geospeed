import { FeatureCollection, Feature, LineString } from 'geojson';

export type SurflogResult = {
  topspeed: number; // fastest speed
  topspeed250?: number; // fastest speed over 250 meter
  topspeed500?: number; // fastest speed over 500 meter
  legs?: number; // number of rides forth and back
  jibespeed?: number; // fastest turn
  planing?: number; // Time planing in % (>18km/h)
}

type SurflogGeoJsonProperties = {
  coordTimes: string[];
}

export interface SurflogFeatureCollection extends FeatureCollection {
  type: "FeatureCollection";
  features: Array<Feature<LineString, SurflogGeoJsonProperties>>;
}
