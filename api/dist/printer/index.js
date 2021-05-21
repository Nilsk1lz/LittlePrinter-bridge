"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = void 0;
const console_1 = __importDefault(require("./console"));
const escpos_1 = __importDefault(require("./escpos"));
const file_writer_1 = __importDefault(require("./file-writer"));
const paperang_1 = __importDefault(require("./paperang"));
const peripage_1 = __importDefault(require("./peripage"));
const all = {
    [console_1.default.type]: console_1.default,
    [escpos_1.default.type]: escpos_1.default,
    [file_writer_1.default.type]: file_writer_1.default,
    [paperang_1.default.type]: paperang_1.default,
    [peripage_1.default.type]: peripage_1.default,
};
exports.all = all;
