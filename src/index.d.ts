import { FeatureCollection, LineString } from 'geojson';

export type SurflogFeatureProperty = {
  timestamp: string;
  speed?: number;
}

export interface GeospeedFeatureProperty extends SurflogFeatureProperty {
  colorSpeed: string;
  speedGPS: number;
}

export type GeospeedProperties = {
  topspeed: number; // fastest speed
  topspeedGPS: number; // fastest speed measured
  topspeed250?: number; // fastest speed measured over 250 meter
  topspeed500?: number; // fastest speed measured over 500 meter
  legs?: number; // number of rides forth and back
  planing?: number; // Time planing in % (>18km/h)
}

export interface GeospeedFeatureCollection extends FeatureCollection<LineString, GeospeedFeatureProperty> {
  properties: GeospeedProperties;
}
