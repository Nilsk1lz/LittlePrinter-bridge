"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTransportAdapter = void 0;
const bluetooth_1 = __importDefault(require("./bluetooth"));
const usb_1 = __importDefault(require("./usb"));
const makeTransportAdapter = (configuration) => {
    switch (configuration.type) {
        case 'usb':
            return new usb_1.default(configuration.parameters);
        case 'bluetooth':
            return new bluetooth_1.default(configuration.parameters);
    }
};
exports.makeTransportAdapter = makeTransportAdapter;
