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
const escpos = __importStar(require("./commander/escpos"));
const typescript_is_1 = require("typescript-is");
const transport_1 = require("../transport");
const logger_1 = __importDefault(require("../logger"));
class default_1 {
    constructor(parameters) {
        this.parameters = parameters;
        this.transport = transport_1.makeTransportAdapter(parameters.transport);
    }
    static areParametersValid(parameters) {
        return typescript_is_1.is(parameters);
    }
    static fromParameters(parameters) {
        return new this(typescript_is_1.assertType(parameters));
    }
    async open() {
        await this.transport.connect();
        await this.write(await escpos.handshake());
    }
    async close() {
        await this.transport.disconnect();
    }
    async print(image) {
        image.resize(this.parameters.image.width);
        try {
            const bits = await image.asBIN();
            await this.write(await escpos.feed());
            await this.write(await escpos.raster(bits, this.parameters.image.width));
            await this.write(await escpos.feed(5));
        }
        catch (error) {
            logger_1.default.error('uh oh: %O', error);
            return false;
        }
        return true;
    }
    async write(buffers) {
        for (const buffer of buffers) {
            await this.transport.write(buffer);
        }
    }
}
exports.default = default_1;
default_1.type = 'escpos';
