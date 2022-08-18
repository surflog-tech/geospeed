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
  topspeedGPS2Sec: number; // fastest 2sec speed measured
  topspeedDevice2Sec: number; // fastest 2sec speed measured
  topspeed100?: number; // fastest speed measured over 100 meter
  topspeed250?: number; // fastest speed measured over 250 meter
  topspeed500?: number; // fastest speed measured over 500 meter
  legs?: number; // number of rides forth and back
  planing?: number; // Time planing in % (>18km/h)
}

export interface GeospeedFeatureCollection extends FeatureCollection<LineString, GeospeedFeatureProperty> {
  properties: GeospeedProperties;
}
