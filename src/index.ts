import { SurflogFeatureCollection, SurflogResult } from './index.d';
import turfLength from '@turf/length';
import { lineString as turfLineString } from '@turf/helpers';

export const kmToKnots = 1.852;
const legLengths = [250, 500];

function dateStrToHours(dateStr: string) {
  const d = new Date(dateStr);
  return d.getTime() / 1000 / 60 / 60;
}

function geospeed({ features }: SurflogFeatureCollection) {
  const coords: number[][] = [];
  const lengths: number[] = [0];
  const times: string[] = [];
  features.forEach(({ geometry: { coordinates }, properties: { coordTimes } }) => {
    coordinates.forEach(([lng, lat], indexC) => {
      coords.push([lng, lat]);
      times.push(coordTimes[indexC]);
      if (indexC === 0) return;
      const lengthInKM = turfLength(turfLineString(coords.slice(coords.length - 2)));
      lengths.push(lengthInKM * 1000);
    });
  });
  const result: SurflogResult = {
    topspeed: 0,
    topspeed250: 0,
    topspeed500: 0
  };
  lengths.forEach((_, indexStart) => {
    lengths.slice(indexStart).reduce((lengthTotal, length, index) => {
      if (index === 0) return 0;
      const lengthSum = lengthTotal + length;
      const time = dateStrToHours(times[indexStart + index]) - dateStrToHours(times[indexStart]);
      const speed = lengthSum / 1000 / time;
      if (speed > result.topspeed) result.topspeed = speed;
      legLengths.forEach((legLength) => {
        const key = `topspeed${legLength}`;
        if (lengthTotal < legLength && lengthSum >= legLength) {
          if (speed > result[key]) result[key] = speed;
        }
      });
      return lengthSum;
    }, 0);
  });

  return result;
}

function convertKMtoKnots(resultInKM: SurflogResult): SurflogResult {
  const result: SurflogResult = {
    topspeed: 0,
    topspeed250: 0,
    topspeed500: 0
  };
  for (const key in resultInKM) {
    result[key] = resultInKM[key] / kmToKnots;
  }
  return result;
}

function handler(geoData: SurflogFeatureCollection): SurflogResult {
  return convertKMtoKnots(geospeed(geoData));
}

export default handler;
