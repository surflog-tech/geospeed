"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const destination_1 = __importDefault(require("@turf/destination"));
const helpers_1 = require("@turf/helpers");
const index_1 = __importDefault(require("./index"));
const index_2 = require("./index");
const strict_1 = __importDefault(require("assert/strict"));
function parseGeoBuffer(geoBuffer) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(geoBuffer.toString());
}
describe('GeoSpeed', () => {
    it('should measure 1km', () => {
        const decimals = 10;
        const start = [-73.97665500640869, 40.778307278822645];
        const { geometry: { coordinates: destination } } = destination_1.default(helpers_1.point(start), 1, 0);
        const lineString = helpers_1.lineString([start, destination]);
        lineString.properties = {
            coordTimes: ['2021-08-08T06:00:00.000Z', '2021-08-08T07:00:00.000Z']
        };
        const featureCollection = helpers_1.featureCollection([lineString]);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const geoData = JSON.parse(JSON.stringify(featureCollection));
        const { topspeed } = index_1.default(geoData);
        strict_1.default.strictEqual(topspeed.toFixed(decimals), (1 / index_2.kmToKnots).toFixed(decimals));
    });
    it('should measure speed', () => {
        const geoFile = './assets/test.json';
        const geoBuffer = fs_1.readFileSync(geoFile);
        const result = index_1.default(parseGeoBuffer(geoBuffer));
        console.log(result);
    });
});
