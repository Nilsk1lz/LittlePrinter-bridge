"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicValue = exports.Packet = exports.PaperType = void 0;
var PaperType;
(function (PaperType) {
    PaperType[PaperType["Receipt"] = 0] = "Receipt";
    PaperType[PaperType["Label"] = 1] = "Label";
})(PaperType = exports.PaperType || (exports.PaperType = {}));
var Packet;
(function (Packet) {
    Packet[Packet["Start"] = 2] = "Start";
    Packet[Packet["End"] = 3] = "End";
})(Packet = exports.Packet || (exports.Packet = {}));
exports.MagicValue = 0x35769521;
