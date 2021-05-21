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
const typescript_is_1 = require("typescript-is");
const pf = __importStar(require("../protocol-fragments"));
const bridge_command_1 = __importDefault(require("../commands/bridge-command"));
const device_command_1 = __importDefault(require("../commands/device-command"));
const logger_1 = __importDefault(require("../../logger"));
const fs_1 = require("fs");
var BergCommandType;
(function (BergCommandType) {
    BergCommandType["BridgeCommand"] = "BridgeCommand";
    BergCommandType["DeviceCommand"] = "DeviceCommand";
})(BergCommandType || (BergCommandType = {}));
var BergBridgeCommandName;
(function (BergBridgeCommandName) {
    BergBridgeCommandName["AddDeviceEncryptionKey"] = "add_device_encryption_key";
    // set_cloud_log_level
    // leave
    // form
    // pjoin
    // restart
    // reboot
})(BergBridgeCommandName || (BergBridgeCommandName = {}));
class BergBridge {
    constructor(parameters, network, devices = []) {
        this.onConnect = async (network) => {
            this.state.isOnline = true;
            const message = pf.CONNECT(this.parameters.address);
            await this.network.send(message);
            this.state.devices.forEach(async (device) => await device.onConnect({
                parameters: this.parameters,
                send: (message) => network.send(message),
            }));
        };
        this.onDisconnect = async () => {
            this.state.isOnline = false;
            this.state.devices.forEach(async (device) => await device.onDisconnect());
        };
        this.onMessage = async (network, message) => {
            try {
                switch (message.type) {
                    case BergCommandType.BridgeCommand:
                        {
                            const json = typescript_is_1.assertType(message);
                            const command = new bridge_command_1.default(json);
                            const response = await this.execute(command);
                            if (response != null) {
                                await network.send(response);
                            }
                        }
                        break;
                    case BergCommandType.DeviceCommand:
                        {
                            if (false) {
                                // handy lil debug dump
                                const filename = `DeviceCommand.${Math.round(new Date().getTime() / 1000)}.json`;
                                logger_1.default.debug('writing command to file: %s', filename);
                                await fs_1.promises.writeFile(filename, Buffer.from(JSON.stringify(message, null, 2)));
                            }
                            const json = typescript_is_1.assertType(message);
                            const command = new device_command_1.default(json);
                            const device = this.deviceAt(command.deviceAddress);
                            if (device != null) {
                                const response = await device.execute(command);
                                if (response != null) {
                                    await network.send(response);
                                }
                            }
                        }
                        break;
                    default:
                        logger_1.default.warn('Unknown command type: %s: %O', message.type, message);
                        break;
                }
            }
            catch (error) {
                // no message needs to be sent if there's an error, so we'll just log it
                logger_1.default.error(`Error processing command: %O`, error);
            }
        };
        this.state = {
            isOnline: false,
            devices: devices,
        };
        this.parameters = parameters;
        this.network = network;
        this.network.delegate = {
            onConnect: this.onConnect,
            onDisconnect: this.onDisconnect,
            onMessage: this.onMessage,
        };
    }
    get isOnline() {
        return this.state.isOnline;
    }
    get devices() {
        return this.state.devices;
    }
    async addDevice(device) {
        if (this.state.devices.includes(device)) {
            return;
        }
        this.state.devices.push(device);
        if (this.state.isOnline) {
            await device.onConnect({
                parameters: this.parameters,
                send: this.network.send,
            });
        }
    }
    async removeDevice(device) {
        const index = this.state.devices.indexOf(device);
        if (index == -1) {
            throw new Error('device not registered with bridge');
        }
        this.state.devices.splice(index, 1);
        if (this.state.isOnline) {
            await device.onDisconnect();
        }
    }
    deviceAt(address) {
        return this.state.devices.find((device) => device.parameters.address === address);
    }
    async start() {
        await this.network.connect();
    }
    async stop() {
        await this.network.disconnect();
    }
    async execute(command) {
        if (command.bridgeAddress !== this.parameters.address) {
            logger_1.default.warn('bridge address does not match: sent (%s) !== us (%s)', command.bridgeAddress, this.parameters.address);
            return null;
        }
        logger_1.default.debug('bridge command: %s', command.commandName);
        switch (command.commandName) {
            case BergBridgeCommandName.AddDeviceEncryptionKey: {
                try {
                    const params = typescript_is_1.assertType(command.params);
                    const device = this.deviceAt(params.device_address);
                    if (device != null) {
                        logger_1.default.debug('saving encryption key for device %s', params.device_address);
                        device.state.encryptionKey = params.encryption_key;
                    }
                }
                catch (error) {
                    logger_1.default.error(`error processing BergBridgeCommandName.AddDeviceEncryptionKey: %O`, error);
                }
                break;
            }
            default:
                logger_1.default.warn('unknown bridge command of name: %s', command.commandName);
        }
        return null;
    }
}
exports.default = BergBridge;
