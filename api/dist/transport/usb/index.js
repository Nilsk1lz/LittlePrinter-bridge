"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usb_1 = __importDefault(require("usb"));
const util_1 = require("util");
const logger_1 = __importDefault(require("../../logger"));
const os_1 = __importDefault(require("os"));
class default_1 {
    constructor(parameters) {
        this.parameters = parameters;
    }
    async connect() {
        if (this.device != null) {
            return;
        }
        if (this.parameters.vid == null || this.parameters.pid == null) {
            throw new Error('scanning for printers not (yet) supported');
        }
        logger_1.default.info('...connecting usb (vid: %d (0x%s), pid: %d (0x%s))', this.parameters.vid, this.parameters.vid.toString(16), this.parameters.pid, this.parameters.pid.toString(16));
        this.device = usb_1.default.findByIds(this.parameters.vid, this.parameters.pid);
        if (this.device == null) {
            throw new Error(`could not find USB device with vid/pid ${this.parameters.vid}/${this.parameters.pid} (0x${this.parameters.vid.toString(16)}/0x${this.parameters.pid.toString(16)})`);
        }
        this.device.open();
        await Promise.all(this.device.interfaces.map(async (iface) => {
            const setAltSetting = util_1.promisify(iface.setAltSetting).bind(iface);
            try {
                await setAltSetting(iface.altSetting);
            }
            catch { }
            if ('win32' !== os_1.default.platform()) {
                if (iface.isKernelDriverActive()) {
                    try {
                        iface.detachKernelDriver();
                    }
                    catch (e) {
                        logger_1.default.error('Could not detatch kernel driver: %s', e);
                    }
                }
            }
            iface.claim();
        }));
        this.in = this.device.interfaces.flatMap((iface) => iface.endpoints.filter((endpoint) => endpoint.direction === 'in'))[0];
        this.out = this.device.interfaces.flatMap((iface) => iface.endpoints.filter((endpoint) => endpoint.direction === 'out'))[0];
        if (this.out == null || this.in == null) {
            throw new Error('could not find valid in/out endpoints for printer');
        }
        this.in.startPoll();
    }
    async disconnect() {
        var _a;
        if (this.in != null) {
            await util_1.promisify(this.in.stopPoll).bind(this.in)();
        }
        (_a = this.device) === null || _a === void 0 ? void 0 : _a.close();
        this.device = undefined;
        this.out = undefined;
        this.in = undefined;
    }
    async write(buffer) {
        if (this.out == null) {
            throw new Error('"out" endpoint not set');
        }
        const transfer = util_1.promisify(this.out.transfer).bind(this.out);
        await transfer(buffer);
    }
    async read() {
        if (this.in == null) {
            throw new Error('"in" endpoint not set');
        }
        return new Promise((resolve, reject) => {
            if (this.in == null) {
                return reject(new Error('"in" endpoint not set'));
            }
            const listener = (buffer) => {
                var _a;
                // if there's an empty buffer, let's skip and resubscribe until there's data
                if (buffer.length === 0) {
                    (_a = this.in) === null || _a === void 0 ? void 0 : _a.once('data', listener);
                    return;
                }
                resolve(buffer);
            };
            this.in.once('data', listener);
        });
    }
}
exports.default = default_1;
