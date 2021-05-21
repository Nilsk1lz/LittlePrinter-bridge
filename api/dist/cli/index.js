"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
exports.default = async () => {
    yargs_1.default
        .commandDir('commands', {
        extensions: ['js', 'ts'],
        visit: (commandModule) => {
            return commandModule.default;
        },
    })
        .strict()
        .demandCommand()
        .showHelpOnFail(true)
        .help().argv;
};
