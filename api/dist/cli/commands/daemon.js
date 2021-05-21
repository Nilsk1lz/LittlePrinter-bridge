"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = {
    command: 'daemon <command>',
    describe: 'Daemon-related commands',
    builder: (yargs) => {
        return yargs.commandDir('daemon', {
            extensions: ['js', 'ts'],
            visit: (commandModule) => {
                return commandModule.default;
            },
        });
    },
    handler: async () => { },
};
exports.default = commander;
