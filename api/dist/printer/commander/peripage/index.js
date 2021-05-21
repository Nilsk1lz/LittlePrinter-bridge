"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryVersion = exports.querySerialNumber = exports.queryModel = exports.handshake = void 0;
const CMD = '\x10';
const handshake = async () => {
    return [
        // 16, -1, -2, 1, 27, 64, 0
        Buffer.from(`${CMD}\xff\xfe\x01\x1b\x40\x00`, 'ascii'),
    ];
};
exports.handshake = handshake;
const queryModel = async () => {
    return [Buffer.from(`${CMD}\xff\x20\xf0`, 'ascii')];
};
exports.queryModel = queryModel;
const queryVersion = async () => {
    return [Buffer.from(`${CMD}\xff\x20\xf1`, 'ascii')];
};
exports.queryVersion = queryVersion;
const querySerialNumber = async () => {
    return [Buffer.from(`${CMD}\xff\x20\xf2`, 'ascii')];
};
exports.querySerialNumber = querySerialNumber;
var escpos_1 = require("../escpos");
Object.defineProperty(exports, "feed", { enumerable: true, get: function () { return escpos_1.feed; } });
Object.defineProperty(exports, "image", { enumerable: true, get: function () { return escpos_1.raster; } });
