"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = __importDefault(require("./configuration"));
const logger_1 = __importDefault(require("./logger"));
class Daemon {
    constructor() {
        this.timer = undefined;
        this.isShuttingDown = false;
    }
    async configure(configurationPath) {
        if (this.bridge != null) {
            logger_1.default.warn("reconfiguring isn't supported (yet!), ignoring request");
            return;
        }
        if (this.printers != null) {
            const printers = this.printers;
            await Promise.all(Object.keys(this.printers).map(async (key) => await printers[key].close()));
        }
        const configuration = await configuration_1.default(configurationPath);
        this.bridge = configuration.bridge;
        this.printers = configuration.printers;
    }
    async run() {
        if (this.bridge == null) {
            logger_1.default.warn('no bridge configured, bailing');
            return;
        }
        if (this.timer != null) {
            return;
        }
        this.timer = setInterval(async () => await this.runServer(), 5000);
        await this.runServer();
    }
    async shutdown() {
        var _a;
        if (this.timer != null) {
            clearInterval(this.timer);
        }
        if (this.isShuttingDown) {
            return;
        }
        this.isShuttingDown = true;
        await ((_a = this.bridge) === null || _a === void 0 ? void 0 : _a.stop());
        if (this.printers != null) {
            const printers = this.printers;
            await Promise.all(Object.keys(this.printers).map(async (key) => await printers[key].close()));
        }
    }
    async runServer() {
        if (this.bridge == null) {
            logger_1.default.warn('no bridge configured, bailing');
            return;
        }
        if (this.printers == null) {
            logger_1.default.warn('no printers configured, bailing');
            return;
        }
        try {
            if (!this.bridge.isOnline) {
                if (this.printers != null) {
                    // TODO: filter by only printers actively used by devices, not just present in config
                    const printers = this.printers;
                    await Promise.all(Object.keys(this.printers).map(async (key) => await printers[key].open()));
                }
                logger_1.default.info('starting bridge!');
                logger_1.default.verbose('bridge address: %s', this.bridge.parameters.address);
                for (let i = 0; i < this.bridge.devices.length; i++) {
                    const device = this.bridge.devices[i];
                    logger_1.default.verbose(` - device #%d address: %s`, i + 1, device.parameters.address);
                }
                await this.bridge.start();
            }
        }
        catch (error) {
            logger_1.default.error(`error, daemon bailed: %O`, error);
        }
    }
}
const daemon = new Daemon();
process.on('SIGINT', async () => {
    logger_1.default.info('shutting down...');
    await daemon.shutdown();
    process.exit();
});
exports.default = daemon;
