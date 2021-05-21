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
exports.BaseBergDevice = exports.BergDeviceCommandResponseCode = void 0;
const pf = __importStar(require("../protocol-fragments"));
const payload_decoder_1 = __importDefault(require("./payload-decoder"));
const logger_1 = __importDefault(require("../../logger"));
var BergDeviceCommandResponseCode;
(function (BergDeviceCommandResponseCode) {
    BergDeviceCommandResponseCode[BergDeviceCommandResponseCode["SUCCESS"] = 0] = "SUCCESS";
    BergDeviceCommandResponseCode[BergDeviceCommandResponseCode["EUI64_NOT_FOUND"] = 1] = "EUI64_NOT_FOUND";
    BergDeviceCommandResponseCode[BergDeviceCommandResponseCode["FAILED_NETWORK"] = 2] = "FAILED_NETWORK";
    BergDeviceCommandResponseCode[BergDeviceCommandResponseCode["INVALID_SEQUENCE"] = 32] = "INVALID_SEQUENCE";
    BergDeviceCommandResponseCode[BergDeviceCommandResponseCode["BUSY"] = 48] = "BUSY";
    BergDeviceCommandResponseCode[BergDeviceCommandResponseCode["INVALID_SIZE"] = 128] = "INVALID_SIZE";
    BergDeviceCommandResponseCode[BergDeviceCommandResponseCode["INVALID_DEVICETYPE"] = 129] = "INVALID_DEVICETYPE";
    BergDeviceCommandResponseCode[BergDeviceCommandResponseCode["FILESYSTEM_ERROR"] = 130] = "FILESYSTEM_ERROR";
    BergDeviceCommandResponseCode[BergDeviceCommandResponseCode["FILESYSTEM_INVALID_ID"] = 144] = "FILESYSTEM_INVALID_ID";
    BergDeviceCommandResponseCode[BergDeviceCommandResponseCode["FILESYSTEM_NO_FREE_FILEHANDLES"] = 145] = "FILESYSTEM_NO_FREE_FILEHANDLES";
    BergDeviceCommandResponseCode[BergDeviceCommandResponseCode["FILESYSTEM_WRITE_ERROR"] = 146] = "FILESYSTEM_WRITE_ERROR";
    BergDeviceCommandResponseCode[BergDeviceCommandResponseCode["BRIDGE_ERROR"] = 255] = "BRIDGE_ERROR";
})(BergDeviceCommandResponseCode = exports.BergDeviceCommandResponseCode || (exports.BergDeviceCommandResponseCode = {}));
const defaultOptions = {
    heartbeatInterval: 10000,
};
class BaseBergDevice {
    constructor(parameters, argOptions = {}) {
        this.deviceTypeId = -1;
        this.heartbeat = async () => {
            if (!this.state.isOnline) {
                logger_1.default.verbose('[device #%s] Connection is offline, sleeping heartbeat', this.parameters.address);
                return;
            }
            if (this.bridge == null) {
                logger_1.default.verbose('[device #%s] No bridge parameters, sleeping heartbeat', this.parameters.address);
                return;
            }
            const needsKey = this.state.encryptionKey == null;
            if (needsKey) {
                logger_1.default.debug('[device #%s] Asked for encryption key', this.parameters.address);
                const message = pf.ENCRYPTION_KEY_REQUIRED(this.bridge.parameters.address, this.parameters.address);
                await this.bridge.send(message);
            }
            else {
                logger_1.default.verbose('[device #%s] Heartbeat. Pom pom.', this.parameters.address);
                const message = pf.HEARTBEAT(this.bridge.parameters.address, this.parameters.address);
                await this.bridge.send(message);
            }
        };
        this.parameters = parameters;
        this.options = {
            ...defaultOptions,
            ...argOptions,
        };
        this.heartbeatRef = undefined;
        this.state = {
            isOnline: false,
        };
    }
    async onConnect(bridge) {
        this.heartbeatRef = setInterval(this.heartbeat, this.options.heartbeatInterval);
        this.bridge = bridge;
        this.state.isOnline = true;
        await this.heartbeat();
    }
    async onDisconnect() {
        if (this.heartbeatRef == null) {
            return;
        }
        clearInterval(this.heartbeatRef);
        this.heartbeatRef = undefined;
        this.bridge = undefined;
        this.state.isOnline = false;
        this.state.encryptionKey = undefined;
    }
    async execute(command) {
        if (command.deviceAddress !== this.parameters.address) {
            logger_1.default.warn('[device #%s] command address does not match: sent (%s) !== us (%s)', this.parameters.address, command.deviceAddress, this.parameters.address);
            return this.makeCommandResponseWithCode(BergDeviceCommandResponseCode.INVALID_DEVICETYPE, command.commandId);
        }
        const buffer = Buffer.from(command.payload, 'base64');
        const payload = await payload_decoder_1.default(buffer);
        if (payload.header.deviceId != this.deviceTypeId) {
            logger_1.default.warn('[device #%s] device ID does not match: sent (%s) !== us (%s)', this.parameters.address, payload.header.deviceId, this.deviceTypeId);
            return this.makeCommandResponseWithCode(BergDeviceCommandResponseCode.BRIDGE_ERROR, payload.header.commandId);
        }
        return await this.handlePayload(payload);
    }
    makeCommandResponseWithCode(code, commandId) {
        if (this.bridge == null) {
            logger_1.default.warn("[device #%s] device got a payload, but doesn't have a bridge. bailing.", this.parameters.address);
            return null;
        }
        return {
            device_address: this.parameters.address,
            timestamp: '0',
            transfer_time: 0,
            bridge_address: this.bridge.parameters.address,
            return_code: code,
            rssi_stats: [0, 0, 0],
            type: 'DeviceCommandResponse',
            command_id: commandId,
        };
    }
}
exports.BaseBergDevice = BaseBergDevice;
