import { Feature, MultiLineString } from 'geojson';

export type SurflogResult = {
  topspeed: number; // fastest speed
  topspeedGPS: number; // fastest speed measured
  topspeed250?: number; // fastest speed measured over 250 meter
  topspeed500?: number; // fastest speed measured over 500 meter
  legs?: number; // number of rides forth and back
  jibespeed?: number; // fastest turn
  planing?: number; // Time planing in % (>18km/h)
  [key: string]: number;
}

type SurflogGeoJsonProperties = {
  coordsMeta: [{
    time: number;
    timestamp: string;
    speed: number;
    distance: number;
  }];
}

export interface SurflogFeature extends Feature {
  properties: SurflogGeoJsonProperties;
  geometry: MultiLineString;
}
