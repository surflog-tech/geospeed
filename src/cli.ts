#!/usr/bin/env node

import { readFile } from 'fs/promises';
import geoSpeed from './index';

function handler(filePath: string): Promise<void> {
  return readFile(filePath).then(geoSpeed).then(console.log);
}

const [,,geoFile] = process.argv;

if (typeof geoFile === 'string') {
  void handler(geoFile);
}
