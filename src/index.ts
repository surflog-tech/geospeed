import { FeatureCollection, LineString } from 'geojson';
import { GeospeedFeatureCollection, GeospeedProperties, SurflogFeatureProperty } from './index.d';
import { featureEach } from '@turf/meta';
import turfDistance from '@turf/distance';
import { getSpeedColor } from './color';
import { outlierFilter } from './outliers';

type Record = {
  timestamp: number;
  distance: number;
}

const legLengths = [250, 500];

function timestampToHours(ts: number) {
  return ts / 1000 / 60 / 60;
}

function geospeed(geoJson: FeatureCollection<LineString, SurflogFeatureProperty>) {
  const geospeedProperties: GeospeedProperties = {
    topspeed: 0,
    topspeedGPS: 0,
    topspeedGPS2Sec: 0,
    topspeed250: 0,
    topspeed500: 0
  };
  const geoJsonResult = geoJson as GeospeedFeatureCollection;
  // prepare data for measurement
  const recordsUnfiltered: Record[] = [];
  featureEach(geoJson, ({ geometry: { coordinates }, properties: { timestamp, speed } }) => {
    if (speed !== undefined && speed > geospeedProperties.topspeed) geospeedProperties.topspeed = speed;
    recordsUnfiltered.push({
      timestamp: (new Date(timestamp)).getTime(),
      distance: turfDistance(coordinates[0], coordinates[1]),
    });
  });
  // remove outliers
  const records = outlierFilter(recordsUnfiltered, 'distance');
  // fastest speed during 2 seconds
  records.reduce((indexPointer, { timestamp }, index, array) => {
    if (index === 0) return index;
    const { timestamp: timestampPrevious } = array[indexPointer];
    const timeDiffMS = timestamp - timestampPrevious;
    if (timeDiffMS < 2000) return indexPointer;
    if (timeDiffMS > 2000) return index;
    const distanceTotal = array.slice(indexPointer + 1, index + 1).reduce((distanceSum, { distance }) => distanceSum + distance, 0);
    const timeDiff = timestampToHours(timeDiffMS);
    const speed = distanceTotal / timeDiff;
    if (speed > geospeedProperties.topspeedGPS2Sec) {
      geospeedProperties.topspeedGPS2Sec = speed;
    }
    return index;
  }, 0);
  // measure
  for (const [indexStart, { timestamp, distance }] of records.entries()) {
    const speedFromDevice = geoJson.features[indexStart].properties.speed;
    if (indexStart > 0) {
      const timeDiff = timestampToHours(timestamp - records[indexStart - 1].timestamp);
      const speed = distance / timeDiff;
      geoJsonResult.features[indexStart].properties.speedGPS = speed;
      geoJsonResult.features[indexStart].properties.colorSpeed = getSpeedColor(speedFromDevice ?? speed);
      if (speed > geospeedProperties.topspeedGPS) geospeedProperties.topspeedGPS = speed;
    } else {
      geoJsonResult.features[indexStart].properties.colorSpeed = getSpeedColor(speedFromDevice);
    }
    records.slice(indexStart).reduce((lengthTotal, { distance }, index) => {
      if (index === 0) return 0;
      const lengthSum = lengthTotal + distance;
      const timeDiff = timestampToHours(records[indexStart + index].timestamp - records[indexStart].timestamp);
      const speed = lengthSum / timeDiff;
      legLengths.forEach((legLength) => {
        const legLengthInKM = legLength / 1000;
        if (lengthTotal < legLengthInKM && lengthSum >= legLengthInKM) {
          const geospeedPropertyKey = `topspeed${legLength}` as keyof GeospeedProperties;
          const geospeedProperty = geospeedProperties[geospeedPropertyKey] as number;
          if (speed > geospeedProperty) geospeedProperties[geospeedPropertyKey] = speed;
        }
      });
      return lengthSum;
    }, 0);
  }
  // set GeoSpeed properties
  geoJsonResult.properties = {
    ...geoJsonResult.properties,
    ...geospeedProperties
  };
  return geoJsonResult;
}

function handler(geoJson: FeatureCollection<LineString, SurflogFeatureProperty>) {
  return geospeed(geoJson);
}

export default handler;
