"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class default_1 {
    constructor(port, address) {
        this.port = port;
        this.address = address;
    }
    get isOpen() {
        return this.port == null;
    }
    async read() {
        if (this.port == null) {
            throw new Error('no port to write from');
        }
        const read = util_1.promisify(this.port.read).bind(this.port);
        return await read();
    }
    async write(buffer) {
        if (this.port == null) {
            throw new Error('no port to write to');
        }
        const write = util_1.promisify(this.port.write).bind(this.port);
        return await write(buffer, this.address);
    }
    async close() {
        var _a;
        (_a = this.port) === null || _a === void 0 ? void 0 : _a.close(this.address);
        this.port = undefined;
    }
}
exports.default = default_1;
