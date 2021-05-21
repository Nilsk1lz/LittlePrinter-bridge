"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../../logger"));
const bluetooth_1 = __importDefault(require("../../../scan/bluetooth"));
const commander = {
    command: 'bluetooth',
    describe: 'Scan for valid Bluetooth devices.',
    handler: async () => {
        logger_1.default.info('starting Bluetooth scan');
        try {
            const results = await bluetooth_1.default();
            logger_1.default.info('found printers: %O', results);
        }
        catch (error) {
            logger_1.default.error('%O', error);
        }
    },
};
exports.default = commander;
