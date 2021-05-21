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
Object.defineProperty(exports, "__esModule", { value: true });
const crc_1 = __importStar(require("../crc"));
describe('CRC', () => {
    describe('IV bytes', () => {
        it('can read the default IV as MV', () => {
            const crc = new crc_1.default(crc_1.MagicValue);
            const iv = crc.ivBytes;
            expect(iv).toEqual(Buffer.from('\x21\x95\x76\x35', 'ascii'));
        });
        it('can set an arbitrary IV', () => {
            const crc = new crc_1.default(1);
            const iv = crc.ivBytes;
            expect(iv).toEqual(Buffer.from('\x20\x95\x76\x35', 'ascii'));
        });
        it('can set the magic IV', () => {
            const crc = new crc_1.default(0x77c40d4d ^ crc_1.MagicValue);
            const iv = crc.ivBytes;
            expect(iv).toEqual(Buffer.from('\x4d\x0d\xc4\x77', 'ascii'));
        });
    });
    describe('checksum bytes', () => {
        it('handshake magicvalue', () => {
            const crc = new crc_1.default(0x77c40d4d ^ crc_1.MagicValue);
            const data = crc.ivBytes;
            const checksum = new crc_1.default(crc_1.MagicValue);
            expect(checksum.checksumBytes(data)).toEqual(Buffer.from('\x69\x92\x95\xed', 'ascii'));
        });
        it('noop', () => {
            const crc = new crc_1.default(0x77c40d4d ^ crc_1.MagicValue);
            const data = Buffer.from('\x00\x00', 'ascii');
            expect(crc.checksumBytes(data)).toEqual(Buffer.from('\x90\x6f\x45\x76', 'ascii'));
        });
        it('feed: 0', () => {
            const crc = new crc_1.default(0x77c40d4d ^ crc_1.MagicValue);
            const data = Buffer.from('\x00\x00', 'ascii');
            expect(crc.checksumBytes(data)).toEqual(Buffer.from('\x90\x6f\x45\x76', 'ascii'));
        });
        it('feed: 200', () => {
            const crc = new crc_1.default(0x77c40d4d ^ crc_1.MagicValue);
            const data = Buffer.from('\xc8\x00', 'ascii');
            expect(crc.checksumBytes(data)).toEqual(Buffer.from('\xd6\x32\x66\x75', 'ascii'));
        });
    });
});
