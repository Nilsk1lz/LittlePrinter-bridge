"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binary_parser_1 = require("binary-parser");
const payloadDecoder = async (buf, offset = 0) => {
    const parser = new binary_parser_1.Parser()
        .endianess('little')
        .skip(offset)
        .uint8('deviceId')
        .uint8('unused', {
        // reserved byte, was never used afaik
        assert: 0x0,
    })
        .uint16('command')
        .uint32('commandId')
        .uint32('crc', {
        assert: 0x0,
    })
        .uint32('length')
        .buffer('blob', {
        length: 'length',
    });
    const result = parser.parse(buf);
    return {
        header: {
            deviceId: result.deviceId,
            command: result.command,
            commandId: result.commandId,
            crc: result.crc,
            length: result.length,
        },
        blob: result.blob,
    };
};
exports.default = payloadDecoder;
