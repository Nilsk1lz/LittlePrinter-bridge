"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fast_bmp_1 = __importDefault(require("fast-bmp"));
// prettier-ignore
// const colorTable = Buffer.from([
//   0x00, 0x00, 0x00, 0x00,
//   0xff, 0xff, 0xff, 0x00,
// ]);
const BITMAP_WIDTH = 384;
const setBit = (buffer, i, bit, value) => {
    if (value == 0) {
        buffer[i] &= ~(1 << bit);
    }
    else {
        buffer[i] |= 1 << bit;
    }
};
const packem = (input, width, height) => {
    // pack grid into bytes
    const buf = new Uint8Array(width * height);
    let ptr = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = width * y + x;
            const byte = Math.floor(ptr / 8);
            const shift = ptr % 8;
            setBit(buf, byte, 8 - shift - 1, input[i]);
            ptr++;
        }
        // let's poke every. single. bit. because that's probably efficient.
        const paddingRequired = 32 - width;
        for (let pad = 0; pad < paddingRequired; pad++) {
            const i = ptr;
            const byte = Math.floor(i / 8);
            const shift = i % 8;
            setBit(buf, byte, 8 - shift - 1, 0);
            ptr++;
        }
    }
    return buf;
};
exports.default = (input) => {
    const bytes = Array.prototype.slice.call(input);
    const width = BITMAP_WIDTH;
    const height = input.length / BITMAP_WIDTH;
    return fast_bmp_1.default.encode({
        width,
        height,
        data: Buffer.from(packem(bytes, width, height)),
        bitDepth: 1,
        components: 1,
        channels: 1,
    });
};
