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
exports.setPrintDensity = exports.setPowerOffTime = exports.setPaperType = exports.selfTest = exports.parseVoltage = exports.parseVersion = exports.parseTemperature = exports.parseStatus = exports.parseSerialNumber = exports.parsePrintDensity = exports.parsePowerOffTime = exports.parsePaperType = exports.parseModel = exports.parseMaximumGapLength = exports.parseHardwareInformation = exports.parseFactoryStatus = exports.parseCountryName = exports.parseBoardVersion = exports.parseBluetoothMAC = exports.parseBatteryStatus = exports.queryVoltage = exports.queryVersion = exports.queryTemperature = exports.queryStatus = exports.querySerialNumber = exports.queryPrintDensity = exports.queryPowerOffTime = exports.queryPaperType = exports.queryModel = exports.queryMaximumGapLength = exports.queryHardwareInformation = exports.queryFactoryStatus = exports.queryCountryName = exports.queryBoardVersion = exports.queryBluetoothMAC = exports.queryBatteryStatus = exports.lineFeed = exports.image = exports.handshake = void 0;
const python_struct_1 = __importDefault(require("python-struct"));
const mutable_buffer_1 = require("mutable-buffer");
const command_1 = __importDefault(require("./command"));
const crc_1 = __importStar(require("./crc"));
const typescript_is_1 = require("typescript-is");
const const_1 = require("./const");
const parse_response_1 = require("./parse-response");
const sharedCRC = new crc_1.default(0x6968634 ^ 0x2e696d);
// I've had problems printing > 64k in a single command to a P2S via bluetooth, ymmv
const MAX_PACKET_LENGTH = 65536;
const slice = (input, width) => {
    const output = [];
    let remaining = input.length;
    let current = 0;
    do {
        output.push(Buffer.from(input.slice(current, current + width)));
        current += width;
        remaining -= width;
    } while (remaining > 0);
    return output;
};
const packeting = (slices, command, crc = sharedCRC) => {
    slices = Array.isArray(slices) ? slices : [slices];
    const packets = [];
    const current = new mutable_buffer_1.MutableBuffer(slices.length > 1 ? MAX_PACKET_LENGTH : slices[0].length, 128);
    for (let i = 0; i < slices.length; i++) {
        const slice = slices[i];
        const buffer = new mutable_buffer_1.MutableBuffer(slice.length + 8, 128);
        buffer.write(python_struct_1.default.pack('<BBB', const_1.Packet.Start, command, i));
        buffer.write(python_struct_1.default.pack('<H', slice.length));
        buffer.write(slice);
        buffer.write(python_struct_1.default.pack('<I', crc.checksum(slice)));
        buffer.write(python_struct_1.default.pack('<B', const_1.Packet.End));
        if (current.size + slice.length > MAX_PACKET_LENGTH) {
            packets.push(Buffer.from(current.flush()));
            current.clear();
        }
        current.write(buffer.flush());
        // if it's the last, just append it
        if (i === slices.length - 1) {
            packets.push(Buffer.from(current.flush()));
        }
    }
    return packets;
};
const handshake = async () => {
    const key = 0x6968634 ^ 0x2e696d;
    const message = python_struct_1.default.pack('<I', key ^ crc_1.MagicValue);
    return packeting(message, command_1.default.SetCrcKey, new crc_1.default(crc_1.MagicValue));
};
exports.handshake = handshake;
const lineFeed = async (ms) => {
    const message = python_struct_1.default.pack('<H', ms);
    return packeting(message, command_1.default.FeedLine);
};
exports.lineFeed = lineFeed;
const selfTest = async () => {
    const message = python_struct_1.default.pack('<B', 0);
    return packeting(message, command_1.default.PrintTestPage);
};
exports.selfTest = selfTest;
const setPaperType = async (paperType) => {
    const message = python_struct_1.default.pack('<B', paperType);
    return packeting(message, command_1.default.SetPaperType);
};
exports.setPaperType = setPaperType;
const queryPowerOffTime = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetPowerDownTime);
};
exports.queryPowerOffTime = queryPowerOffTime;
const setPowerOffTime = async (time) => {
    const message = python_struct_1.default.pack('<H', time);
    return packeting(message, command_1.default.SetPowerDownTime);
};
exports.setPowerOffTime = setPowerOffTime;
const queryPrintDensity = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetHeatDensity);
};
exports.queryPrintDensity = queryPrintDensity;
const setPrintDensity = async (density) => {
    const message = python_struct_1.default.pack('<B', density);
    return packeting(message, command_1.default.SetHeatDensity);
};
exports.setPrintDensity = setPrintDensity;
const queryBatteryStatus = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetBatStatus);
};
exports.queryBatteryStatus = queryBatteryStatus;
const querySerialNumber = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetSn);
};
exports.querySerialNumber = querySerialNumber;
const queryHardwareInformation = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetHwInfo);
};
exports.queryHardwareInformation = queryHardwareInformation;
const queryPaperType = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetPaperType);
};
exports.queryPaperType = queryPaperType;
const queryVersion = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetVersion);
};
exports.queryVersion = queryVersion;
const queryCountryName = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetCountryName);
};
exports.queryCountryName = queryCountryName;
const queryMaximumGapLength = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetMaxGapLength);
};
exports.queryMaximumGapLength = queryMaximumGapLength;
const queryBoardVersion = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetBoardVersion);
};
exports.queryBoardVersion = queryBoardVersion;
const queryFactoryStatus = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetFactoryStatus);
};
exports.queryFactoryStatus = queryFactoryStatus;
const queryTemperature = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetTemp);
};
exports.queryTemperature = queryTemperature;
const queryVoltage = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetVoltage);
};
exports.queryVoltage = queryVoltage;
const queryStatus = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetStatus);
};
exports.queryStatus = queryStatus;
const queryBluetoothMAC = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetBtMac);
};
exports.queryBluetoothMAC = queryBluetoothMAC;
const queryModel = async () => {
    const message = python_struct_1.default.pack('<B', 1);
    return packeting(message, command_1.default.GetModel);
};
exports.queryModel = queryModel;
const parseBatteryStatus = (buffer) => {
    const response = parse_response_1.parseResponseForCommand(buffer, command_1.default.SentBatStatus);
    const unpacked = python_struct_1.default.unpack('<B', response.payload);
    return typescript_is_1.assertType(unpacked[0]);
};
exports.parseBatteryStatus = parseBatteryStatus;
const parseBluetoothMAC = (buffer) => {
    const response = parse_response_1.parseResponseForCommand(buffer, command_1.default.SentBtMac);
    return response.payload.toString('ascii');
};
exports.parseBluetoothMAC = parseBluetoothMAC;
const parseBoardVersion = (buffer) => {
    const response = parse_response_1.parseResponseForCommand(buffer, command_1.default.SentBoardVersion);
    return response.payload.toString('ascii');
};
exports.parseBoardVersion = parseBoardVersion;
const parseCountryName = (buffer) => {
    const response = parse_response_1.parseResponseForCommand(buffer, command_1.default.SentCountryName);
    return response.payload.toString('ascii');
};
exports.parseCountryName = parseCountryName;
const parseFactoryStatus = (buffer) => {
    const response = parse_response_1.parseResponseForCommand(buffer, command_1.default.SentFactoryStatus);
    const unpacked = python_struct_1.default.unpack('<B', response.payload);
    return typescript_is_1.assertType(unpacked[0]);
};
exports.parseFactoryStatus = parseFactoryStatus;
const parseHardwareInformation = () => {
    // haven't seen this in the wild, not sure how responses look
    throw new Error('not implemented');
};
exports.parseHardwareInformation = parseHardwareInformation;
const parseMaximumGapLength = (buffer) => {
    const response = parse_response_1.parseResponseForCommand(buffer, command_1.default.SentMaxGapLength);
    const unpacked = python_struct_1.default.unpack('<B', response.payload);
    return typescript_is_1.assertType(unpacked[0]);
};
exports.parseMaximumGapLength = parseMaximumGapLength;
const parseModel = (buffer) => {
    const response = parse_response_1.parseResponseForCommand(buffer, command_1.default.SentModel);
    return response.payload.toString('ascii');
};
exports.parseModel = parseModel;
const parsePaperType = (buffer) => {
    const response = parse_response_1.parseResponseForCommand(buffer, command_1.default.SentPaperType);
    const unpacked = python_struct_1.default.unpack('<B', response.payload);
    return typescript_is_1.assertType(unpacked[0]);
};
exports.parsePaperType = parsePaperType;
const parsePowerOffTime = (buffer) => {
    const response = parse_response_1.parseResponseForCommand(buffer, command_1.default.SentPowerDownTime);
    const unpacked = python_struct_1.default.unpack('<B', response.payload);
    return typescript_is_1.assertType(unpacked[0]);
};
exports.parsePowerOffTime = parsePowerOffTime;
const parsePrintDensity = (buffer) => {
    const response = parse_response_1.parseResponseForCommand(buffer, command_1.default.SentHeatDensity);
    const unpacked = python_struct_1.default.unpack('<B', response.payload);
    return typescript_is_1.assertType(unpacked[0]);
};
exports.parsePrintDensity = parsePrintDensity;
const parseSerialNumber = (buffer) => {
    const response = parse_response_1.parseResponseForCommand(buffer, command_1.default.SentSn);
    return response.payload.toString('ascii');
};
exports.parseSerialNumber = parseSerialNumber;
const parseStatus = (buffer) => {
    const response = parse_response_1.parseResponseForCommand(buffer, command_1.default.SentStatus);
    const unpacked = python_struct_1.default.unpack('<BB', response.payload);
    typescript_is_1.assertType(unpacked[0]);
    typescript_is_1.assertType(unpacked[1]);
    return 0;
};
exports.parseStatus = parseStatus;
const parseTemperature = () => {
    // haven't seen this in the wild, not sure how responses look
    throw new Error('not implemented');
};
exports.parseTemperature = parseTemperature;
const parseVersion = (buffer) => {
    const response = parse_response_1.parseResponseForCommand(buffer, command_1.default.SentVersion);
    const unpacked = python_struct_1.default.unpack('<BBB', response.payload);
    typescript_is_1.assertType(unpacked[0]);
    typescript_is_1.assertType(unpacked[1]);
    typescript_is_1.assertType(unpacked[2]);
    return unpacked.join('.');
};
exports.parseVersion = parseVersion;
const parseVoltage = () => {
    // haven't seen this in the wild, not sure how responses look
    throw new Error('not implemented');
};
exports.parseVoltage = parseVoltage;
const image = async (buffer, width) => {
    return packeting(slice(buffer, width), command_1.default.PrintData);
};
exports.image = image;
