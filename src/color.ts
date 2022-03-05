import { scale } from 'chroma-js';

const speedMax = 110; // km/h
const colorPalette = ['black', 'blue', 'purple', 'red', 'orange', 'yellow'];
const speedColorScale = scale(colorPalette);

export function getSpeedColor(speed = 0) {
  return speedColorScale(speed / speedMax).hex();
}
