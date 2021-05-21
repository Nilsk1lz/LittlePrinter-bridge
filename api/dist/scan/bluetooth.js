"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const device_1 = __importDefault(require("../transport/bluetooth/device"));
const inq = new device_1.default();
const findChannel = async (address) => {
    return new Promise((resolve, reject) => {
        inq.findSerialPortChannel(address, (channel) => {
            if (channel >= 0) {
                resolve(channel);
            }
            else {
                reject();
            }
        });
    });
};
const scan = async () => {
    return new Promise((resolve, reject) => {
        inq.inquire(async (error, devices) => {
            if (error != null) {
                return reject(error);
            }
            const printers = [];
            for (const device of devices) {
                try {
                    const channel = await findChannel(device.address);
                    if (channel != null) {
                        printers.push({
                            ...device,
                            channel,
                        });
                    }
                }
                catch {
                    // can't find channel, so we'll ignore the device
                }
            }
            resolve(printers);
        });
        // TODO: check via listPairedDevices - do we need to auth in the system first?
    });
};
exports.default = scan;
