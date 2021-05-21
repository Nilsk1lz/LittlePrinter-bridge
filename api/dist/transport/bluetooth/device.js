"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bindings_1 = __importDefault(require("bindings"));
const DeviceINQ = bindings_1.default('BluetoothSerialPort.node')
    .DeviceINQ;
class default_1 extends DeviceINQ {
}
exports.default = default_1;
