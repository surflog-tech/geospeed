#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const index_1 = __importDefault(require("./index"));
function parseGeoBuffer(geoBuffer) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(geoBuffer.toString());
}
function handler(filePath) {
    return promises_1.readFile(filePath).then(parseGeoBuffer).then(index_1.default).then(console.log);
}
const [, , geoFile] = process.argv;
if (typeof geoFile === 'string') {
    void handler(geoFile);
}
