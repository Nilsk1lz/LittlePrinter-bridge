"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const js_1 = __importDefault(require("./js"));
const json_1 = __importDefault(require("./json"));
const yaml_1 = __importDefault(require("./yaml"));
const parse = async (path) => {
    const extension = path_1.default.extname(path);
    switch (extension) {
        case '.js':
            return await js_1.default(path);
        case '.json':
            return await json_1.default(path);
        case '.yaml':
        case '.yml':
            return await yaml_1.default(path);
        default:
            throw new Error(`unknown configuration file type: ${extension}`);
    }
};
exports.default = parse;
