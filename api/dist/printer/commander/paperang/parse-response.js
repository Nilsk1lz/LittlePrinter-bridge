"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResponseForCommand = void 0;
const command_1 = __importDefault(require("./command"));
const python_struct_1 = __importDefault(require("python-struct"));
const typescript_is_1 = require("typescript-is");
const const_1 = require("./const");
const lookupCommandName = (command) => {
    let commandKey = null;
    for (const key in command_1.default) {
        const v = command_1.default[key];
        if (command === v) {
            commandKey = key;
            break;
        }
    }
    if (commandKey == null) {
        throw new Error(`unknown command: ${command}`);
    }
    return commandKey;
};
const parseResponse = (buffer) => {
    let base = 0;
    const results = [];
    while (base < buffer.length && buffer.readUInt8() === const_1.Packet.Start) {
        const unpacked = python_struct_1.default.unpack('<BBBH', buffer.slice(base, base + 5));
        const command = typescript_is_1.assertType(unpacked[1]);
        const length = typescript_is_1.assertType(unpacked[3]);
        const name = lookupCommandName(command);
        const payload = buffer.slice(base + 5, base + 5 + length);
        const crc32 = buffer.slice(base + 5 + length, base + 9 + length);
        const result = {
            command,
            name,
            length,
            payload,
            payloadAscii: payload.toString('ascii'),
            crc32,
        };
        results.push(result);
        base += 10 + length;
    }
    return results;
};
const parseResponseForCommand = (buffer, command) => {
    const response = parseResponse(buffer).find((r) => r.command == command);
    if (response == null) {
        throw new Error(`could not find ${lookupCommandName(command)} in response`);
    }
    return response;
};
exports.parseResponseForCommand = parseResponseForCommand;
exports.default = parseResponse;
