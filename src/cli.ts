#!/usr/bin/env node

import parseGeoBuffer from './parse';
import { readFile } from 'fs/promises';
import geoSpeed from './index';

function handler(filePath: string): Promise<void> {
  return readFile(filePath).then(parseGeoBuffer).then(geoSpeed).then(console.log);
}

const [,,geoFile] = process.argv;

if (typeof geoFile === 'string') {
  void handler(geoFile);
}
