#!/usr/bin/env node

import { SurflogFeature } from './index.d';
import { readFile } from 'fs/promises';
import geoSpeed from './index';

function parseGeoBuffer(geoBuffer: ArrayBuffer): SurflogFeature {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(geoBuffer.toString());
}

function handler(filePath: string): Promise<void> {
  return readFile(filePath).then(parseGeoBuffer).then(geoSpeed).then(console.log);
}

const [,,geoFile] = process.argv;

if (typeof geoFile === 'string') {
  void handler(geoFile);
}
