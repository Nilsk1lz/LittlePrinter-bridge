"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const usb_1 = __importStar(require("usb"));
const typescript_is_1 = require("typescript-is");
const fetchStringDescriptor = async (device, descriptor) => {
    if (descriptor === 0) {
        return undefined;
    }
    return new Promise((resolve, reject) => {
        try {
            device.open();
            device.getStringDescriptor(descriptor, (error, result) => {
                device.close();
                if (error != null) {
                    return reject(error);
                }
                if (result == null) {
                    return resolve(undefined);
                }
                // note, the argument is actually a string, not a buffer, so we'll cast it over
                const string = typescript_is_1.assertType(result);
                // the string is padded with null bytes out of the buffer, so we'll need to deal with that
                resolve(string.replace(/\0/g, ''));
            });
        }
        catch (error) {
            // we want ~a~ value, so send something back
            resolve(undefined);
        }
    });
};
const scan = async () => {
    return new Promise(async (resolve, reject) => {
        const devices = usb_1.default.getDeviceList();
        const printers = devices.filter((device) => {
            try {
                return (device.configDescriptor.interfaces.filter((iface) => {
                    return (iface.filter((descriptor) => {
                        return descriptor.bInterfaceClass === usb_1.LIBUSB_CLASS_PRINTER;
                    }).length > 0);
                }).length > 0);
            }
            catch (error) {
                return false;
            }
        });
        try {
            const found = await Promise.all(printers.map(async (printer) => {
                return {
                    vid: printer.deviceDescriptor.idVendor,
                    pid: printer.deviceDescriptor.idProduct,
                    name: await fetchStringDescriptor(printer, printer.deviceDescriptor.iProduct),
                    manufacturer: await fetchStringDescriptor(printer, printer.deviceDescriptor.iManufacturer),
                    serialNumber: await fetchStringDescriptor(printer, printer.deviceDescriptor.iSerialNumber),
                };
            }));
            resolve(found);
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.default = scan;
