"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const daemon_1 = __importDefault(require("../../../daemon"));
const logger_1 = __importDefault(require("../../../logger"));
const commander = {
    command: 'run',
    describe: 'Print an image (or multiple images) to a printer',
    builder: (yargs) => {
        return yargs.option('config', {
            alias: 'c',
            type: 'string',
            describe: 'Runs a sirius-client daemon.',
            default: 'config/default.yaml',
        });
    },
    handler: async (argv) => {
        logger_1.default.info('starting daemon, reading from configuration file: %s', argv.config);
        await daemon_1.default.configure(argv.config);
        await daemon_1.default.run();
    },
};
exports.default = commander;
