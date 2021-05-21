"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.default = async (path) => {
    return JSON.parse(await fs_1.promises.readFile(path, 'utf8'));
};
