"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = {
    command: 'scan <command>',
    describe: 'Scan commands',
    builder: (yargs) => {
        return yargs.commandDir('scan', {
            extensions: ['js', 'ts'],
            visit: (commandModule) => {
                return commandModule.default;
            },
        });
    },
    handler: async () => { },
};
exports.default = commander;
