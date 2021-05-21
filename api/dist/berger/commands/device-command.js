"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BergDeviceCommand {
    constructor(json) {
        this.timestamp = new Date();
        this.bridgeAddress = json.bridge_address;
        this.deviceAddress = json.device_address;
        this.commandId = json.command_id;
        this.payload = json.binary_payload;
    }
}
exports.default = BergDeviceCommand;
