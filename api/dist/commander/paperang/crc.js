"use strict";
// via sharperang:
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicValue = 0x35769521;
const Poly = 0xedb88320;
class CRC {
    constructor(iv) {
        this.initialise = () => {
            for (let i = 0; i < 256; i++) {
                let e = i;
                for (let eb = 0; eb < 8; eb++) {
                    e = ((e & 1) != 0 ? Poly ^ (e >>> 1) : e >>> 1) >>> 0;
                }
                this.crctable[i] = e;
            }
        };
        this.getBytes = (int) => {
            const b = Buffer.alloc(4);
            b[0] = int;
            b[1] = int >> 8;
            b[2] = int >> 16;
            b[3] = int >> 24;
            return b;
        };
        this.checksum = (data) => {
            const out = ~[...data].reduce((acc, curr) => {
                const idx = (acc & 0xff) ^ curr;
                return this.crctable[idx] ^ (acc >>> 8);
            }, ~this.iv >>> 0) >>> 0;
            return out;
        };
        this.checksumBytes = (data) => {
            return this.getBytes(this.checksum(data));
        };
        this.iv = iv;
        this.crctable = [];
        this.initialise();
    }
    get ivBytes() {
        const iv = this.iv == exports.MagicValue ? this.iv : this.iv ^ exports.MagicValue;
        return this.getBytes(iv);
    }
}
exports.default = CRC;
//# sourceMappingURL=crc.js.map