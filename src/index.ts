import { SurflogFeatureCollection, SurflogResult } from './index.d';
import turfLength from '@turf/length';
import { lineString as turfLineString } from '@turf/helpers';

function parseGeoBuffer(geoBuffer: ArrayBuffer): SurflogFeatureCollection {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(geoBuffer.toString());
}

function dateStrToHours(dateStr: string) {
  const d = new Date(dateStr);
  return d.getTime() / 1000 / 60 / 60;
}

function geospeed({ features }: SurflogFeatureCollection) {
  const coords: number[][] = [];
  const times: string[] = [];
  let topspeed = 0;
  features.forEach(({ geometry: { coordinates }, properties: { coordTimes } }) => {
    coordinates.forEach(([lng, lat], indexC) => {
      coords.push([lng, lat]);
      times.push(coordTimes[indexC]);
      if (coords.length > 1) {
        const kmLast = turfLength(turfLineString(coords.slice(coords.length - 2)));
        const timeLast = dateStrToHours(times[times.length - 1]) - dateStrToHours(times[times.length - 2]);
        const speedLast = kmLast / timeLast;
        if (speedLast > topspeed) topspeed = speedLast;
      }
    });
  });
  return {
    topspeed,
  };
}

function handler(geoBuffer: ArrayBuffer): SurflogResult {
  return geospeed(parseGeoBuffer(geoBuffer));
}

export default handler;
