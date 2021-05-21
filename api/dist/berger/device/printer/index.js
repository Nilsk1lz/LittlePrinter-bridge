"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BergPrinterCommandName = void 0;
const __1 = require("..");
const payload_decoder_1 = __importDefault(require("./payload-decoder"));
const logger_1 = __importDefault(require("../../../logger"));
const LITTLE_PRINTER_DEVICE_ID = 1;
var BergPrinterCommandName;
(function (BergPrinterCommandName) {
    BergPrinterCommandName[BergPrinterCommandName["SetDeliveryAndPrint"] = 1] = "SetDeliveryAndPrint";
    BergPrinterCommandName[BergPrinterCommandName["SetDelivery"] = 2] = "SetDelivery";
    BergPrinterCommandName[BergPrinterCommandName["SetDeliveryAndPrintNoFace"] = 17] = "SetDeliveryAndPrintNoFace";
    BergPrinterCommandName[BergPrinterCommandName["SetDeliveryNoFace"] = 18] = "SetDeliveryNoFace";
    BergPrinterCommandName[BergPrinterCommandName["SetPersonality"] = 258] = "SetPersonality";
    BergPrinterCommandName[BergPrinterCommandName["SetPersonalityWithMessage"] = 257] = "SetPersonalityWithMessage";
    BergPrinterCommandName[BergPrinterCommandName["SetQuip"] = 514] = "SetQuip";
})(BergPrinterCommandName = exports.BergPrinterCommandName || (exports.BergPrinterCommandName = {}));
class BergPrinter extends __1.BaseBergDevice {
    constructor(parameters, printerHandler, argOptions = {}) {
        super(parameters, argOptions);
        this.deviceTypeId = LITTLE_PRINTER_DEVICE_ID;
        this.printerHandler = printerHandler;
    }
    async handlePayload(payload) {
        switch (payload.header.command) {
            case BergPrinterCommandName.SetDeliveryAndPrint:
            case BergPrinterCommandName.SetDeliveryAndPrintNoFace:
                // TODO: print a face along with it, as necessary
                const success = this.print(payload.blob);
                return this.makeCommandResponseWithCode(success
                    ? __1.BergDeviceCommandResponseCode.SUCCESS
                    : __1.BergDeviceCommandResponseCode.BUSY, payload.header.commandId);
                break;
            // how does "set delivery" differ? why wouldn't we print?
            case BergPrinterCommandName.SetDelivery:
            case BergPrinterCommandName.SetDeliveryNoFace:
                logger_1.default.warn('[device #%s] unhandled printer command: SetDelivery(NoFace) (%d)', this.parameters.address, payload.header.command);
                break;
            case BergPrinterCommandName.SetPersonality:
            case BergPrinterCommandName.SetPersonalityWithMessage:
                logger_1.default.warn('[device #%s] unhandled printer command: SetPersonality(WithMessage) (%d)', this.parameters.address, payload.header.command);
                break;
            case BergPrinterCommandName.SetQuip:
                logger_1.default.warn('[device #%s] unhandled printer command: SetQuip (%d)', this.parameters.address, payload.header.command);
                break;
            default:
                logger_1.default.warn('[device #%s] unknown printer command (%d)', this.parameters.address, payload.header.command);
                break;
        }
        return this.makeCommandResponseWithCode(__1.BergDeviceCommandResponseCode.BRIDGE_ERROR, payload.header.commandId);
    }
    async print(buffer) {
        if (this.printerHandler) {
            const decoded = await payload_decoder_1.default(buffer);
            return await this.printerHandler.print(decoded);
        }
        return false;
    }
}
exports.default = BergPrinter;
