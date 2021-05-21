"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const typescript_is_1 = require("typescript-is");
const payload_decoder_1 = __importDefault(require("../../../berger/device/payload-decoder"));
const payload_decoder_2 = __importDefault(require("../../../berger/device/printer/payload-decoder"));
const unrle_1 = __importDefault(require("../../../berger/device/printer/unrle"));
const index_1 = require("../../../configuration/index");
const logger_1 = __importDefault(require("../../../logger"));
const printable_image_1 = __importDefault(require("../../../printable-image"));
const commander = {
    command: 'payload <files...>',
    describe: 'Print a payload (or multiple payloads) to a printer',
    builder: (yargs) => {
        return yargs
            .positional('files', {
            describe: 'payload to print',
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
            const string = await fs_1.promises.readFile(file, 'ascii');
            const payload = typescript_is_1.assertType(JSON.parse(string));
            // process file as though it's a command
            const buffer = Buffer.from(payload.binary_payload, 'base64');
            const devicePayload = await payload_decoder_1.default(buffer);
            const printerPayload = await payload_decoder_2.default(devicePayload.blob);
            // turn buffer into image
            const bits = await unrle_1.default(printerPayload.rle.data);
            const image = printable_image_1.default.fromBits(bits);
            await printer.print(image, printerPayload);
        }
        await printer.close();
    },
};
exports.default = commander;
