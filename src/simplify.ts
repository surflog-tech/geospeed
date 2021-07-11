import { AllGeoJSON } from '@turf/helpers';
import turfSimplify from '@turf/simplify';

function simplify(geoJSON: AllGeoJSON): AllGeoJSON {
  const options = {
    highQuality: true,
    tolerance: 0.000000000000001,
    // mutate: true
  };
  return turfSimplify(geoJSON, options);
}

export default simplify;
