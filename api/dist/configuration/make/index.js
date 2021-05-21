"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const printable_image_wrapper_1 = __importDefault(require("../../printer/printable-image-wrapper"));
const typescript_is_1 = require("typescript-is");
const printer_1 = __importDefault(require("../../berger/device/printer"));
const bridge_1 = __importDefault(require("../../berger/bridge"));
const ws_1 = __importDefault(require("../../berger/bridge/network/ws"));
const printers_1 = __importDefault(require("./printers"));
const logger_1 = __importDefault(require("../../logger"));
// TODO: parse section-by-section, so errors are more localised
// TODO: validate inputs, i.e. that addresses aren't empty strings, etc
exports.default = async (config) => {
    if (!typescript_is_1.is(config)) {
        throw new Error('config malformed, bailing');
    }
    // set up actual printers
    const printers = await printers_1.default(config.printers);
    const printersInUse = {};
    // set up virtual devices
    const devices = [];
    for (const name in config.bridge.devices) {
        const deviceConfig = config.bridge.devices[name];
        if (deviceConfig.type !== 'littleprinter') {
            logger_1.default.error('only supported device is littleprinter, %s is %s', name, deviceConfig.type);
            continue;
        }
        const handler = printers[deviceConfig.handler];
        if (handler == null) {
            logger_1.default.error('can\'t find handler named "%s" (valid handlers are: %s)', deviceConfig.handler, Object.keys(printers)
                .map((s) => `"${s}"`)
                .join(', '));
            continue;
        }
        const parameters = {
            address: deviceConfig.address,
        };
        const littleprinter = new printer_1.default(parameters, new printable_image_wrapper_1.default(handler));
        printersInUse[deviceConfig.handler] = handler;
        devices.push(littleprinter);
    }
    // set up a network
    const network = new ws_1.default(config.network.uri);
    // dump it all onto the bridge!
    const parameters = {
        address: config.bridge.address,
    };
    return {
        bridge: new bridge_1.default(parameters, network, devices),
        printers: printersInUse,
    };
};
