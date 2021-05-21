"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = {
    command: 'print <command>',
    describe: 'Print something to a printer',
    builder: (yargs) => {
        return yargs.commandDir('print', {
            extensions: ['js', 'ts'],
            visit: (commandModule) => {
                return commandModule.default;
            },
        });
    },
    handler: async (argv) => { },
};
exports.default = commander;
