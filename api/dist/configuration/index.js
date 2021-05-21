"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printer = void 0;
const parse_1 = __importDefault(require("./parse"));
const make_1 = __importDefault(require("./make"));
const printers_1 = __importDefault(require("./make/printers"));
const typescript_is_1 = require("typescript-is");
const printer = async (path, name) => {
    const obj = await parse_1.default(path);
    const configuration = typescript_is_1.assertType(obj);
    const printers = await printers_1.default(configuration.printers);
    const keys = Object.keys(printers);
    if (keys.length === 0) {
        throw new Error(`no printers defined in config file at ${path}`);
    }
    if (name == null) {
        const printer = printers[keys[0]];
        if (printer == null) {
            throw new Error(`no printer configurations found`);
        }
        return printer;
    }
    else {
        const printer = printers[name];
        if (printer == null) {
            throw new Error(`can not find configuration for printer named ${name}`);
        }
        return printer;
    }
};
exports.printer = printer;
exports.default = async (path) => {
    const configuration = await parse_1.default(path);
    return await make_1.default(configuration);
};
