"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("../ws"));
const jest_websocket_mock_1 = __importDefault(require("jest-websocket-mock"));
const fakeURL = 'ws://localhost:8989';
describe('ws', () => {
    let mockServer;
    let ws;
    beforeEach(async () => {
        mockServer = new jest_websocket_mock_1.default(fakeURL);
        ws = new ws_1.default(fakeURL);
    });
    afterEach(() => {
        jest_websocket_mock_1.default.clean();
    });
    it('calls delegate methods', async () => {
        ws.delegate = {
            onConnect: jest.fn(() => Promise.resolve(undefined)),
            onDisconnect: jest.fn(() => Promise.resolve(undefined)),
            onMessage: jest.fn(() => Promise.resolve(undefined)),
        };
        await ws.connect();
        await mockServer.connected;
        const obj = { foo: 'hello, world!' };
        mockServer.send(Buffer.from(JSON.stringify(obj)));
        await mockServer.nextMessage;
        await ws.disconnect();
        await mockServer.closed;
        expect(ws.delegate.onConnect).toHaveBeenCalledWith(ws);
        expect(ws.delegate.onDisconnect).toHaveBeenCalledWith(ws);
        expect(ws.delegate.onMessage).toHaveBeenCalledWith(ws, obj);
    });
    it('throws when connecting twice', async () => {
        await expect(ws.connect()).resolves.toBeUndefined();
        await mockServer.connected;
        await expect(ws.connect()).rejects.toThrow();
    });
    it('allows connecting after disconnecting', async () => {
        await expect(ws.connect()).resolves.toBeUndefined();
        await mockServer.connected;
        await expect(ws.disconnect()).resolves.toBeUndefined();
        await mockServer.closed;
        await expect(ws.connect()).resolves.toBeUndefined();
        await mockServer.connected;
    });
    it('sends data when connected', async () => {
        await expect(ws.connect()).resolves.toBeUndefined();
        await mockServer.connected;
        const message = { foo: 'bar' };
        await expect(ws.send(message)).resolves.toBeUndefined();
        await mockServer.nextMessage;
        const string = JSON.stringify(message);
        await expect(mockServer).toReceiveMessage(string);
    });
    it('throws trying to send data when not connected', async () => {
        const message1 = { foo: 'bar' };
        await expect(ws.send(message1)).rejects.toThrow();
    });
});
