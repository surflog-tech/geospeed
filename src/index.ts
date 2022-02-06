import { SurflogFeature, SurflogResult } from './index.d';
import turfDistance from '@turf/distance';

type Record = {
  time: number;
  distance: number;
}

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
    const records: Record[] = [];
    coordinatesLine.forEach(([lng1, lat1], indexCoord) => {
      const { time, speed } = coordsMeta[indexCoordsMeta];
      if (speed > result.topspeed) result.topspeed = speed;
      indexCoordsMeta += 1;
      if (indexCoord === 0) {
        records.push({ time, distance: 0 });
        return;
      }
      const [lng2, lat2] = coordinatesLine[indexCoord - 1];
      const distance = turfDistance([lng2, lat2], [lng1, lat1]);
      records.push({ time, distance });
    });
    records.forEach((_, indexStart) => {
      if (indexStart > 0) {
        const timeDiff = timestampToHours(records[indexStart].time - records[indexStart - 1].time);
        const speed = records[indexStart].distance / timeDiff;
        if (speed > result.topspeedGPS) result.topspeedGPS = speed;
      }
      records.slice(indexStart).reduce((lengthTotal, { distance }, index) => {
        if (index === 0) return 0;
        const lengthSum = lengthTotal + distance;
        const timeDiff = timestampToHours(records[indexStart + index].time - records[indexStart].time);
        const speed = lengthSum / timeDiff;
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

function handler(geoJSON: SurflogFeature): SurflogResult {
  return geospeed(geoJSON);
}

export default handler;
