"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const terminal_image_1 = __importDefault(require("terminal-image"));
const logger_1 = __importDefault(require("../logger"));
class Console {
    static areParametersValid(parameters) {
        return true;
    }
    static fromParameters(parameters) {
        return new this();
    }
    async open() { }
    async close() { }
    async print(image, payload) {
        return new Promise(async (resolve) => {
            logger_1.default.debug('printing image: %O', payload);
            // if we've come from a payload, it must be upside down
            if (payload != null) {
                image.rotate(180).resize(750);
            }
            const png = await image.asPNG();
            console.log(await terminal_image_1.default.buffer(png, {
                width: 60,
                height: 40,
                preserveAspectRatio: false,
            }));
            resolve(true);
        });
    }
}
Console.type = 'console';
exports.default = Console;
