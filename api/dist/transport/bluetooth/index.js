"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bindings_1 = __importDefault(require("bindings"));
const BTSerialPortBinding = bindings_1.default('BluetoothSerialPort.node')
    .BTSerialPortBinding;
const connection_1 = __importDefault(require("./connection"));
const logger_1 = __importDefault(require("../../logger"));
class default_1 {
    constructor(parameters) {
        this.parameters = parameters;
    }
    async connect() {
        logger_1.default.info('...connecting bt (%s, channel: %d)', this.parameters.address, this.parameters.channel);
        const port = await new Promise((resolve, reject) => {
            const port = new BTSerialPortBinding(this.parameters.address, this.parameters.channel, () => {
                resolve(port);
            }, (error) => {
                reject(error);
            });
        });
        this.connection = new connection_1.default(port, this.parameters.address);
    }
    async disconnect() {
        var _a;
        logger_1.default.info('...disconnecting bt (%s)', this.parameters.address);
        await ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.close());
        this.connection = undefined;
    }
    async write(buffer) {
        var _a;
        logger_1.default.debug('...writing bt (%s), %d bytes', this.parameters.address, buffer.length);
        await ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.write(buffer));
    }
    async read() {
        if (this.connection == null) {
            throw new Error('no bluetooth connection found!');
        }
        logger_1.default.debug('...reading bt (%s)', this.parameters.address);
        const result = await this.connection.read();
        logger_1.default.debug('...reading bt (%s): got %d bytes', this.parameters.address, result.length);
        return result;
    }
}
exports.default = default_1;
