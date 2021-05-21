"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
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
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transport.connect();
            yield this.write(yield paperang.handshake());
            yield this.write(yield paperang.setPowerOffTime(0));
            yield this.dumpStatus();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transport.disconnect();
        });
    }
    print(image) {
        return __awaiter(this, void 0, void 0, function* () {
            image.resize(this.parameters.image.width);
            try {
                yield this.write(yield paperang.image(yield image.asBIN(), this.parameters.image.width), false);
                yield this.write(yield paperang.lineFeed(75));
            }
            catch (error) {
                logger_1.default.error('uh oh: %O', error);
                return false;
            }
            return true;
        });
    }
    write(buffers, waitForRead = true) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const buffer of buffers) {
                yield this.transport.write(buffer);
                if (waitForRead) {
                    yield this.transport.read();
                }
            }
        });
    }
    dumpStatus() {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield this.write(yield command.query(), false);
                try {
                    const result = command.parse(yield this.transport.read());
                    logger_1.default.debug('%s: %s', command.name, result);
                }
                catch (error) {
                    logger_1.default.debug('%s: unknown', command.name);
                }
            }
        });
    }
}
PaperangPrinter.type = 'paperang';
exports.default = PaperangPrinter;
//# sourceMappingURL=paperang.js.map