"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineSpace = exports.feed = exports.imageesc = exports.raster = exports.handshake = void 0;
const python_struct_1 = __importDefault(require("python-struct"));
const ESC = '\x1b';
const GS = `\x1d`;
const EOL = '\x0a';
var Density;
(function (Density) {
    Density[Density["SingleDensity8Dot"] = 0] = "SingleDensity8Dot";
    Density[Density["DoubleDensity8Dot"] = 1] = "DoubleDensity8Dot";
    Density[Density["SingleDensity24Dot"] = 32] = "SingleDensity24Dot";
    Density[Density["DoubleDensity24Dot"] = 33] = "DoubleDensity24Dot";
})(Density || (Density = {}));
var RasterMode;
(function (RasterMode) {
    RasterMode[RasterMode["Normal"] = 0] = "Normal";
    RasterMode[RasterMode["DoubleWidth"] = 1] = "DoubleWidth";
    RasterMode[RasterMode["DoubleHeight"] = 2] = "DoubleHeight";
    RasterMode[RasterMode["DoubleWidthDoubleHeight"] = 3] = "DoubleWidthDoubleHeight";
})(RasterMode || (RasterMode = {}));
const slice = (input, width) => {
    const output = [];
    let remaining = input.length;
    let current = 0;
    do {
        output.push(Buffer.from(input.slice(current, current + width)));
        current += width;
        remaining -= width;
    } while (remaining > 0);
    return output;
};
const handshake = async () => {
    return [
        Buffer.from(`${ESC}\x40`, 'ascii'),
        Buffer.from(`${GS}\x49\x01`, 'ascii'),
        Buffer.from(`${ESC}\x74\x00`, 'ascii'),
    ];
};
exports.handshake = handshake;
const lineSpace = async (lineSpace) => {
    if (lineSpace == null) {
        return [Buffer.from(`${ESC}\x32`, 'ascii')];
    }
    else {
        return [
            Buffer.concat([
                Buffer.from(`${ESC}\x33`, 'ascii'),
                python_struct_1.default.pack('<B', lineSpace),
            ]),
        ];
    }
};
exports.lineSpace = lineSpace;
// gs v 0
const raster = async (bits, width, rasterMode = RasterMode.Normal) => {
    // XXX: 8k buffer is fairly conservative, but could be configurable if necessary?
    const COMMAND_BUFFER_LENGTH = 8192 - 8; // add space for header!
    if (width > COMMAND_BUFFER_LENGTH) {
        throw new Error(`image too wide to print! no room in buffer to draw a row. (buffer: ${COMMAND_BUFFER_LENGTH}, width: ${width}).`);
    }
    const maximumRowsThatCanFitInBuffer = Math.floor(COMMAND_BUFFER_LENGTH / width);
    const blobs = slice(bits, width * maximumRowsThatCanFitInBuffer);
    return blobs.map((blob) => {
        const w = width / 8;
        const h = (blob.length / width) * 8;
        const header = Buffer.concat([
            Buffer.from(`${GS}\x76\x30`, 'ascii'),
            python_struct_1.default.pack('<B', rasterMode),
            python_struct_1.default.pack('<H', w),
            python_struct_1.default.pack('<H', h),
        ]);
        return Buffer.concat([header, blob]);
    });
};
exports.raster = raster;
// TODO: this is extremely broken:
//  -> convert buffer from bits to bitmap format (see: https://github.com/song940/node-escpos/blob/v3/packages/printer/image.js)
// esc *
const imageesc = async (bits, width, density = Density.SingleDensity8Dot) => {
    const is24Dot = (density) => {
        return (density === Density.SingleDensity24Dot ||
            density === Density.DoubleDensity24Dot);
    };
    const n = is24Dot(density) ? 3 : 1;
    const w = width / 8;
    const header = Buffer.concat([
        Buffer.from(`${ESC}\x2a`, 'ascii'),
        python_struct_1.default.pack('<B', density),
        python_struct_1.default.pack('<H', w),
    ]);
    const rows = slice(bits, w * n).map((row) => {
        return Buffer.concat([header, row, Buffer.from(EOL, 'ascii')]);
    });
    return [...(await lineSpace(0)), ...rows, ...(await lineSpace())];
};
exports.imageesc = imageesc;
const feed = async (lines = 1) => {
    return Array(lines).fill(Buffer.from(EOL, 'ascii'));
};
exports.feed = feed;
