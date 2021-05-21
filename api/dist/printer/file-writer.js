"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const typescript_is_1 = require("typescript-is");
const logger_1 = __importDefault(require("../logger"));
var Format;
(function (Format) {
    Format["BIN"] = "bin";
    Format["PNG"] = "png";
})(Format || (Format = {}));
class default_1 {
    constructor(parameters) {
        this.parameters = parameters;
    }
    static areParametersValid(parameters) {
        return typescript_is_1.is(parameters);
    }
    static fromParameters(parameters) {
        return new this(typescript_is_1.assertType(parameters));
    }
    async open() {
        this.mkdir(this.parameters.directory);
    }
    async close() { }
    async print(image, payload) {
        try {
            // if we've come from a payload, it must be upside down
            if (payload != null) {
                image.rotate(180);
            }
            image.resize(this.parameters.image.width);
            const buffer = await this.bufferise(image);
            // TODO: obvioussssly a name based on date this won't play well with a
            // lot of connections, but it's fine for now
            const now = new Date();
            const filename = `${now.toISOString().replace(/[^0-9]/g, '-')}.${this.parameters.format}`;
            const path = path_1.default.join(this.parameters.directory, filename);
            logger_1.default.debug(`writing to: %s`, path);
            await fs_1.promises.writeFile(path, buffer);
            return true;
        }
        catch (error) {
            logger_1.default.error('FileWriter error: %O', error);
            return false;
        }
    }
    async mkdir(path) {
        try {
            await fs_1.promises.mkdir(path);
        }
        catch (error) {
            if (error.code === 'EEXIST') {
                // Something already exists, but is it a file or directory?
                const lstat = await fs_1.promises.lstat(path);
                if (!lstat.isDirectory()) {
                    throw error;
                }
            }
            else {
                throw error;
            }
        }
    }
    async bufferise(image) {
        switch (this.parameters.format) {
            case Format.PNG:
                return await image.asPNG();
            case Format.BIN:
                return await image.asBIN();
        }
    }
}
exports.default = default_1;
default_1.type = 'file_writer';
