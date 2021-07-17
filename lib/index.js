"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kmToKnots = void 0;
const length_1 = __importDefault(require("@turf/length"));
const helpers_1 = require("@turf/helpers");
exports.kmToKnots = 1.852;
const legLengths = [250, 500];
function dateStrToHours(dateStr) {
    const d = new Date(dateStr);
    return d.getTime() / 1000 / 60 / 60;
}
function geospeed({ features }) {
    const coords = [];
    const lengths = [0];
    const times = [];
    features.forEach(({ geometry: { coordinates }, properties: { coordTimes } }) => {
        coordinates.forEach(([lng, lat], indexC) => {
            coords.push([lng, lat]);
            times.push(coordTimes[indexC]);
            if (indexC === 0)
                return;
            const lengthInKM = length_1.default(helpers_1.lineString(coords.slice(coords.length - 2)));
            lengths.push(lengthInKM * 1000);
        });
    });
    const result = {
        topspeed: 0,
        topspeed250: 0,
        topspeed500: 0
    };
    lengths.forEach((_, indexStart) => {
        lengths.slice(indexStart).reduce((lengthTotal, length, index) => {
            if (index === 0)
                return 0;
            const lengthSum = lengthTotal + length;
            const time = dateStrToHours(times[indexStart + index]) - dateStrToHours(times[indexStart]);
            const speed = lengthSum / 1000 / time;
            if (speed > result.topspeed)
                result.topspeed = speed;
            legLengths.forEach((legLength) => {
                const key = `topspeed${legLength}`;
                if (lengthTotal < legLength && lengthSum >= legLength) {
                    if (speed > result[key])
                        result[key] = speed;
                }
            });
            return lengthSum;
        }, 0);
    });
    return result;
}
function convertKMtoKnots(resultInKM) {
    const result = {
        topspeed: 0,
        topspeed250: 0,
        topspeed500: 0
    };
    for (const key in resultInKM) {
        result[key] = resultInKM[key] / exports.kmToKnots;
    }
    return result;
}
function handler(geoData) {
    return convertKMtoKnots(geospeed(geoData));
}
exports.default = handler;
