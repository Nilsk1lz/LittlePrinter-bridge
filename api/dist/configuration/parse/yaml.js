"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const js_yaml_1 = __importDefault(require("js-yaml"));
exports.default = async (path) => {
    return js_yaml_1.default.safeLoad(await fs_1.promises.readFile(path, 'utf8'));
};
