import { scale } from 'chroma-js';

const speedMax = 150; // km/h
const colorPalette = ['#777777', '#8F36AA', '#F19C38'];
const speedColorScale = scale(colorPalette);

export function getSpeedColor(speed = 0) {
  return speedColorScale(speed / speedMax).hex();
}
