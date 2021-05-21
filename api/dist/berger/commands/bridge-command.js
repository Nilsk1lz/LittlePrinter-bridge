"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BergBridgeCommand {
    constructor(json) {
        this.timestamp = new Date();
        this.bridgeAddress = json.bridge_address;
        this.commandId = json.command_id;
        this.params = json.json_payload.params;
        this.commandName = json.json_payload.name;
    }
}
exports.default = BergBridgeCommand;
