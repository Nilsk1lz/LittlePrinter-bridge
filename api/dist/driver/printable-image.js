"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gm_1 = __importDefault(require("gm"));
const bitmapify_1 = __importDefault(require("./bitmapify"));
const im = gm_1.default.subClass({ imageMagick: true });
class PrintableImage {
    constructor(bitmap) {
        this.bitmap = bitmap;
    }
    gm() {
        if (this.gmState != null) {
            return this.gmState;
        }
        const gmState = im(this.bitmap);
        this.gmState = gmState;
        return gmState;
    }
    static fromBits(bits) {
        const bitmap = bitmapify_1.default(bits);
        return new PrintableImage(bitmap);
    }
    asBMP() {
        return __awaiter(this, void 0, void 0, function* () {
            const gm = this.gm().colors(2).define('png:bit-depth=1').monochrome();
            return new Promise((resolve, reject) => {
                gm.toBuffer('BMP', (err, out) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(out);
                });
            });
        });
    }
    asPNG() {
        return __awaiter(this, void 0, void 0, function* () {
            const gm = this.gm().colors(2).define('png:bit-depth=1').monochrome();
            return new Promise((resolve, reject) => {
                gm.toBuffer('PNG', (err, out) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(out);
                });
            });
        });
    }
    asBIN() {
        return __awaiter(this, void 0, void 0, function* () {
            const gm = this.gm()
                .colors(2) // automatically applies dithering
                .out('-depth', '1')
                .negative();
            return new Promise((resolve, reject) => {
                gm.toBuffer('GRAY', (err, out) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(out);
                });
            });
        });
    }
    resize(width) {
        this.gmState = this.gm().resize(width);
        return this;
    }
    dither() {
        this.gmState = this.gm()
            .colorspace('gray')
            .colors(2) // automatically applies dithering
            .out('-type', 'bilevel'); // putting this here forces it at the end of the command (otherwise `gm` will push it to the start, ruining the effect)
        return this;
    }
    rotate(degrees) {
        this.gmState = this.gm().rotate('white', degrees);
        return this;
    }
}
exports.default = PrintableImage;
//# sourceMappingURL=printable-image.js.map