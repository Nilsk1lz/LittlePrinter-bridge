"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../../logger"));
const usb_1 = __importDefault(require("../../../scan/usb"));
const commander = {
    command: 'usb',
    describe: 'Scan for valid USB devices.',
    handler: async () => {
        logger_1.default.info('starting USB scan');
        try {
            const results = await usb_1.default();
            const resultsWithHex = results.map((result) => {
                return {
                    ...result,
                    vid: `${result.vid.toString(10)} (0x${result.vid.toString(16)})`,
                    pid: `${result.pid.toString(10)} (0x${result.pid.toString(16)})`,
                };
            });
            logger_1.default.info('found printers: %O', resultsWithHex);
        }
        catch (error) {
            logger_1.default.error('%O', error);
        }
    },
};
exports.default = commander;
