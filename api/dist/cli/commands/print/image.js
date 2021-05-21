"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const index_1 = require("../../../configuration/index");
const printable_image_1 = __importDefault(require("../../../printable-image"));
const logger_1 = __importDefault(require("../../../logger"));
const commander = {
    command: 'image <files...>',
    describe: 'Print an image (or multiple images) to a printer',
    builder: (yargs) => {
        return yargs
            .positional('files', {
            describe: 'images to print (png, jpg, etc)',
            type: 'string',
            demandOption: true,
        })
            .option('config', {
            alias: 'c',
            type: 'string',
            describe: 'Path to config file.',
            default: 'config/default.yaml',
        })
            .option('printer', {
            alias: 'p',
            type: 'string',
            describe: 'Identifier of printer to use.',
        });
    },
    handler: async (argv) => {
        argv.files = Array.isArray(argv.files) ? argv.files : [argv.files];
        logger_1.default.info('reading from configuration file: %s', argv.config);
        if (argv.printer != null) {
            logger_1.default.info('using printer: %s', argv.printer);
        }
        else {
            logger_1.default.info('using default printer');
        }
        // find printer
        const printer = await index_1.printer(argv.config, argv.printer);
        await printer.open();
        // print 'em
        for (const file of argv.files) {
            logger_1.default.info('printing file: %s', file);
            // load file
            const buffer = await fs_1.promises.readFile(file);
            const image = new printable_image_1.default(buffer);
            image.dither();
            await printer.print(image, undefined);
        }
        await printer.close();
    },
};
exports.default = commander;
