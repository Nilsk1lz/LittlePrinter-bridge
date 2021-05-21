"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unrle_1 = __importStar(require("../unrle"));
const fs_1 = __importDefault(require("fs"));
describe('unrle', () => {
    describe('bloop', () => {
        const runner = (input, expected) => {
            const actual = unrle_1.bloop(input);
            expect(actual).toEqual(expected);
        };
        it('should bloop simplest: [1]', () => {
            runner([1], [1]);
        });
        it('should bloop simplest run: [2]', () => {
            runner([2], [1, 1]);
        });
        it('should bloop simplest combined run: [2, 2]', () => {
            runner([2, 2], [1, 1, 0, 0]);
        });
        it('should bloop simplest combined flipflop run: [2, 2, 1, 1]', () => {
            runner([2, 2, 1, 1], [1, 1, 0, 0, 1, 0]);
        });
    });
    describe('decompress', () => {
        const runner = (input, expected) => {
            const actual = unrle_1.decompress(input);
            expect(actual).toEqual(expected);
        };
        it('handles big numbers, I dunno', () => {
            const thing = [
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                254,
                3,
                1,
            ];
            runner(thing, [50304, 3, 1]);
        });
        describe('single values', () => {
            it('should decode simplest: [1]', () => {
                runner([1], [1]);
            });
            it('should work below first boundary: [250]', () => {
                runner([250], [250]);
            });
            it('should work at first boundary: [251]', () => {
                runner([251], [251]);
            });
            it('should work at first boundary + 1: [251, 0, 1]', () => {
                runner([251, 0, 1], [252]);
            });
            it('should work below second boundary: [251, 0, 132]', () => {
                runner([251, 0, 132], [383]);
            });
            it('should work at second boundary: [252]', () => {
                runner([252], [384]);
            });
            it('should work at second boundary + 1: [252, 0, 1]', () => {
                runner([252, 0, 1], [385]);
            });
            it('should work at second boundary + first boundary: [252, 0, 251]', () => {
                runner([252, 0, 251], [635]);
            });
            it('should work at second boundary + first boundary + 1: [252, 0, 251, 0, 1]', () => {
                runner([252, 0, 251, 0, 1], [636]);
            });
            it('should work below max boundary: [254, 0, 251, 0, 132]', () => {
                runner([254, 0, 251, 0, 132], [1535]);
            });
            it('should work at max boundary: [255]', () => {
                runner([255], [1536]);
            });
            it('should work at max boundary + 1: [255, 0, 1]', () => {
                runner([255, 0, 1], [1537]);
            });
            it('should work at max boundary * 2: [255, 0, 255]', () => {
                runner([255, 0, 255], [3072]);
            });
            it('should work at max boundary * 2 + 1: [255, 0, 255, 0, 1]', () => {
                runner([255, 0, 255, 0, 1], [3073]);
            });
            it('should work at max boundary * first boundary + 1: [255, 0, 251, 0, 1]', () => {
                runner([255, 0, 251, 0, 1], [1788]);
            });
        });
        describe('runs', () => {
            it('should work at twice at max boundry + 1: [251, 0, 1, 251, 0, 1]', () => {
                runner([251, 0, 1, 251, 0, 1], [252, 252]);
            });
        });
    });
    describe('unrle', () => {
        it('fixture', async () => {
            const fixture = require('./__data__/rle-image.ts').default;
            const expected = await fs_1.default.readFileSync(__dirname + '/__data__/rle-image.bytes');
            const result = await unrle_1.default(fixture);
            expect(result.length).toBe(59520);
            expect(result).toEqual(expected);
        });
    });
});
