import { SurflogFeature, SurflogResult } from './index.d';
import turfDistance from '@turf/distance';

export const kmToKnots = 1.852;
const legLengths = [250, 500];

function timestampToHours(ts: number) {
  return ts / 1000 / 60 / 60;
}

function geospeed(geoJSON: SurflogFeature) {
  const result: SurflogResult = {
    topspeed: 0,
    topspeedGPS: 0,
    topspeed250: 0,
    topspeed500: 0
  };
  let indexCoordsMeta = 0;
  const { geometry: { coordinates: coordinatesMultiLine }, properties: { coordsMeta } } = geoJSON;
  coordinatesMultiLine.forEach((coordinatesLine) => {
    const distances: number[] = [0];
    const times: number[] = [];
    coordinatesLine.forEach(([lng1, lat1], indexCoord) => {
      const { time, speed } = coordsMeta[indexCoordsMeta];
      times.push(time);
      if (speed > result.topspeed) result.topspeed = speed;
      indexCoordsMeta += 1;
      if (indexCoord === 0) return;
      const [lng2, lat2] = coordinatesLine[indexCoord - 1];
      const timeDiff = timestampToHours(times[indexCoord] - times[indexCoord - 1]);
      const distance = turfDistance([lng2, lat2], [lng1, lat1]);
      distances.push(distance);
      const topspeedGPS = distance / timeDiff;
      if (topspeedGPS > result.topspeedGPS) result.topspeedGPS = topspeedGPS;
    });
    distances.forEach((_, indexStart) => {
      distances.slice(indexStart).reduce((lengthTotal, length, index) => {
        if (index === 0) return 0;
        const lengthSum = lengthTotal + length;
        const time = timestampToHours(times[indexStart + index] - times[indexStart]);
        const speed = lengthSum / time;
        legLengths.forEach((legLength) => {
          const legLengthInKM = legLength / 1000;
          const key = `topspeed${legLength}`;
          if (lengthTotal < legLengthInKM && lengthSum >= legLengthInKM) {
            if (speed > result[key]) result[key] = speed;
          }
        });
        return lengthSum;
      }, 0);
    });
  });
  return result;
}

function convertKMtoKnots(resultInKM: SurflogResult): SurflogResult {
  const result: SurflogResult = { topspeed: 0, topspeedGPS: 0 };
  for (const [key, value] of Object.entries(resultInKM)) {
    result[key] = value / kmToKnots;
  }
  return result;
}

function handler(geoJSON: SurflogFeature): SurflogResult {
  return convertKMtoKnots(geospeed(geoJSON));
}

export default handler;
