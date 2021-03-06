"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
class MockNetwork {
    async connect() {
        var _a;
        // console.log(this.delegate?.onConnect);
        await ((_a = this.delegate) === null || _a === void 0 ? void 0 : _a.onConnect(this));
    }
    async disconnect() {
        var _a;
        // console.log(this.delegate?.onDisconnect);
        await ((_a = this.delegate) === null || _a === void 0 ? void 0 : _a.onDisconnect(this));
    }
    async send(message) {
        return Promise.resolve();
    }
    async mockMessage(message) {
        if (this.delegate == null) {
            throw new Error('delegate not set');
        }
        await this.delegate.onMessage(this, message);
    }
}
describe('bridge', () => {
    let network;
    beforeEach(() => {
        network = new MockNetwork();
    });
    it('starts/stops the network', async () => {
        const parameters = {
            address: 'foo',
        };
        const spyConnect = jest.spyOn(network, 'connect');
        const spyDisconnect = jest.spyOn(network, 'disconnect');
        const bridge = new index_1.default(parameters, network);
        expect(bridge.isOnline).toBe(false);
        await bridge.start();
        await expect(spyConnect).toHaveBeenCalled();
        expect(bridge.isOnline).toBe(true);
        await bridge.stop();
        await expect(spyDisconnect).toHaveBeenCalled();
        expect(bridge.isOnline).toBe(false);
        spyConnect.mockReset();
        spyDisconnect.mockReset();
    });
    // it('reject invalid JSON message', async () => {
    //   const parameters: BergBridgeParamaters = {
    //     address: 'foo',
    //   };
    //   const network = new MockNetwork();
    //   const bridge = new BergBridge(parameters, network);
    //   await bridge.start();
    //   const spySend = jest.spyOn(network, 'send');
    //   await network.mockMessage({ foo: 'bar' });
    //   expect(spySend).not.toHaveBeenCalled();
    //   spySend.mockReset();
    // });
    // it('accepts valid bridge command', async () => {
    //   const parameters: BergBridgeParamaters = {
    //     address: 'foo',
    //   };
    //   const bridge = new BergBridge(parameters, network);
    //   await bridge.start();
    //   const spySend = jest.spyOn(network, 'send');
    //   const command = {
    //     timestamp: '',
    //     type: 'BridgeCommand',
    //     command_id: 1,
    //     bridge_address: 'abc',
    //     json_payload: {
    //       params: {},
    //       name: 'foo',
    //     },
    //   };
    //   await network.mockMessage(command);
    //   expect(spySend).toHaveBeenCalled();
    //   spySend.mockReset();
    // });
    // it('accepts valid device command', async () => {
    //   const parameters: BergBridgeParamaters = {
    //     address: 'foo',
    //   };
    //   const bridge = new BergBridge(parameters, network);
    //   await bridge.start();
    //   const spySend = jest.spyOn(network, 'send');
    //   const command = {
    //     binary_payload: '',
    //     bridge_address: '',
    //     command_id: 1,
    //     device_address: '',
    //     timestamp: '',
    //     type: 'DeviceCommand',
    //   };
    //   await network.mockMessage(command);
    //   expect(spySend).toHaveBeenCalled();
    //   spySend.mockReset();
    // });
    // it('ignores message not for this bridge', async () => {});
    // it('sends `power_on` bridge event when connecting', async () => {});
    // it('passes message to correct device', async () => {
    //   // const device1 = new jest.mock<Device>();
    //   // const device2 = new jest.mock<Device>();
    //   // const bridge = new Bridge(parameters, '', [device1, device2]);
    //   // const message = {
    //   //   payload: {
    //   //     device_id: device1.parameters.deviceId,
    //   //   },
    //   // };
    //   // await bridge.handleMessage(message);
    //   // expect(device1.handleMessage).toHaveBeenCalled();
    //   // expect(device2.handleMessage).not.toHaveBeenCalled();
    // });
    // it('rejects invalid device ID', async () => {});
    // it('responds with success message', async () => {});
    // it('responds with failure message', async () => {});
    // it('notifies devices of onConnect state', async () => {});
    // it('notifies devices of onDisconnect state', async () => {});
    // it('notifies added devices immediately if online', async () => {});
});
