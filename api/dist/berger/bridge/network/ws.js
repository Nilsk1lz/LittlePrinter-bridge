"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const logger_1 = __importDefault(require("../../../logger"));
class BergBridgeNetworkWS {
    constructor(uri) {
        this.uri = uri;
    }
    async connect() {
        if (this.ws != null) {
            throw new Error('Connection already up, please reset first!');
        }
        const ws = new ws_1.default(this.uri);
        ws.addEventListener('open', async () => {
            var _a;
            logger_1.default.debug('ws:open');
            await ((_a = this.delegate) === null || _a === void 0 ? void 0 : _a.onConnect(this));
        });
        ws.addEventListener('close', async (event) => {
            var _a;
            logger_1.default.debug('ws:close: %d %s', event.code, event.reason);
            await ((_a = this.delegate) === null || _a === void 0 ? void 0 : _a.onDisconnect(this));
            this.ws = undefined;
        });
        ws.addEventListener('message', async (event) => {
            var _a;
            logger_1.default.debug('ws:message: %s', typeof event.data);
            try {
                const stringIn = typeof event.data === 'string' ? event.data : event.data.toString();
                const command = JSON.parse(stringIn);
                const response = await ((_a = this.delegate) === null || _a === void 0 ? void 0 : _a.onMessage(this, command));
                if (response != null) {
                    await this.send(response);
                }
            }
            catch (error) {
                logger_1.default.debug('ws:oh no: %O', error);
                throw error;
            }
        });
        ws.addEventListener('error', (error) => {
            logger_1.default.debug('ws:error: %O', error);
        });
        // I guess these aren't available in the browser?
        // Or at least, not via mocks in testing.
        // So, only run these when available.
        if (ws.addListener) {
            ws.addListener('ping', () => {
                logger_1.default.debug('ws:ping');
            });
            ws.addListener('pong', () => {
                logger_1.default.debug('ws:pong');
            });
            ws.addListener('unexpected-response', (param) => {
                logger_1.default.debug('ws:unexpected-response: %O', param);
            });
            ws.addListener('upgrade', () => {
                logger_1.default.debug('ws:upgrade');
            });
        }
        this.ws = ws;
    }
    async disconnect() {
        logger_1.default.debug('debug: network:disconnect');
        if (this.ws == null) {
            return;
        }
        this.ws.close();
    }
    async send(message) {
        logger_1.default.debug('debug: network:send');
        if (this.ws == null) {
            throw new Error('not connected, bailing');
        }
        const string = JSON.stringify(message);
        this.ws.send(string, {
            compress: false,
            binary: false,
            mask: true,
            fin: true,
        });
    }
}
exports.default = BergBridgeNetworkWS;
