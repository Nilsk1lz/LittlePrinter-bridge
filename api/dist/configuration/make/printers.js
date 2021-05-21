"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const are_parameters_valid_1 = __importDefault(require("./are-parameters-valid"));
const from_parameters_1 = __importDefault(require("./from-parameters"));
const printer_1 = require("../../printer");
const logger_1 = __importDefault(require("../../logger"));
/* eslint-enable @typescript-eslint/no-explicit-any */
exports.default = async (config) => {
    const printers = {};
    for (const name in config) {
        const printerConfig = config[name];
        const printerClass = printer_1.all[printerConfig.driver.toLowerCase()];
        if (printerClass == null) {
            logger_1.default.error("can't find printer driver with name: %s", printerConfig.driver);
            continue;
        }
        if (!are_parameters_valid_1.default(printerClass, printerConfig.parameters)) {
            logger_1.default.error('invalid config for printer: %s, skipping config', printerConfig.driver);
            continue;
        }
        printers[name] = from_parameters_1.default(printerClass, printerConfig.parameters);
    }
    return printers;
};
