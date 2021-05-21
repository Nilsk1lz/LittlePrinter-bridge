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
const paperang = __importStar(require("./commander/paperang/index"));
const typescript_is_1 = require("typescript-is");
const transport_1 = require("../transport");
const logger_1 = __importDefault(require("../logger"));
class PaperangPrinter {
    constructor(parameters) {
        this.parameters = parameters;
        this.transport = transport_1.makeTransportAdapter(parameters.transport);
    }
    static areParametersValid(parameters) {
        return typescript_is_1.is(parameters);
    }
    static fromParameters(parameters) {
        return new this(typescript_is_1.assertType(parameters));
    }
    async open() {
        await this.transport.connect();
        await this.write(await paperang.handshake());
        await this.write(await paperang.setPowerOffTime(0));
        await this.dumpStatus();
    }
    async close() {
        await this.transport.disconnect();
    }
    async print(image) {
        image.resize(this.parameters.image.width);
        try {
            await this.write(await paperang.image(await image.asBIN(), this.parameters.image.width), false);
            await this.write(await paperang.lineFeed(75));
        }
        catch (error) {
            logger_1.default.error('uh oh: %O', error);
            return false;
        }
        return true;
    }
    async write(buffers, waitForRead = true) {
        for (const buffer of buffers) {
            await this.transport.write(buffer);
            if (waitForRead) {
                await this.transport.read();
            }
        }
    }
    async dumpStatus() {
        const commands = [
            {
                name: 'battery status',
                query: paperang.queryBatteryStatus,
                parse: paperang.parseBatteryStatus,
            },
            {
                name: 'bluetooth MAC',
                query: paperang.queryBluetoothMAC,
                parse: paperang.parseBluetoothMAC,
            },
            {
                name: 'board version',
                query: paperang.queryBoardVersion,
                parse: paperang.parseBoardVersion,
            },
            {
                name: 'country name',
                query: paperang.queryCountryName,
                parse: paperang.parseCountryName,
            },
            {
                name: 'factor status',
                query: paperang.queryFactoryStatus,
                parse: paperang.parseFactoryStatus,
            },
            {
                name: 'hardware information',
                query: paperang.queryHardwareInformation,
                parse: paperang.parseHardwareInformation,
            },
            {
                name: 'maximum gap length',
                query: paperang.queryMaximumGapLength,
                parse: paperang.parseMaximumGapLength,
            },
            { name: 'model', query: paperang.queryModel, parse: paperang.parseModel },
            {
                name: 'paper type',
                query: paperang.queryPaperType,
                parse: paperang.parsePaperType,
            },
            {
                name: 'power off time',
                query: paperang.queryPowerOffTime,
                parse: paperang.parsePowerOffTime,
            },
            {
                name: 'print density',
                query: paperang.queryPrintDensity,
                parse: paperang.parsePrintDensity,
            },
            {
                name: 'serial number',
                query: paperang.querySerialNumber,
                parse: paperang.parseSerialNumber,
            },
            {
                name: 'status',
                query: paperang.queryStatus,
                parse: paperang.parseStatus,
            },
            {
                name: 'temperature',
                query: paperang.queryTemperature,
                parse: paperang.parseTemperature,
            },
            {
                name: 'version',
                query: paperang.queryVersion,
                parse: paperang.parseVersion,
            },
            {
                name: 'voltage',
                query: paperang.queryVoltage,
                parse: paperang.parseVoltage,
            },
        ];
        for (const command of commands) {
            await this.write(await command.query(), false);
            try {
                const result = command.parse(await this.transport.read());
                logger_1.default.debug('%s: %s', command.name, result);
            }
            catch (error) {
                logger_1.default.debug('%s: unknown', command.name);
            }
        }
    }
}
exports.default = PaperangPrinter;
PaperangPrinter.type = 'paperang';
