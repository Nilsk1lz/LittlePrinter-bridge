"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const payload_decoder_1 = __importDefault(require("../payload-decoder"));
describe('payloadDecoder', () => {
    it('works with good fixture', async () => {
        // TODO: let's fetch this from a file somewhere, yeah?
        const fixture = 'TwYAAAAAFQAAAB1zA+gdYdAdLw8dRIAbKhAdAAAAMAEvBgAA/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/APwA+AOAA/oDfwP7A4AC+wN/A/sAAQKAAvsDfwPjBwoFAgMJBggDCQMGBhEDCAMJAwkGDAUDA+ALBggBAwcKBwIIAwUKEAMHAwkDBwkJCQEC4AQBAQEBAQMFBAEBAQYGBAEBAQQGAwkCBQMBAQEFDwQGAwkDBgQBAQEFBgQBAQEG4AMIAQQEBgQFBAYDBgIIAw0DEQMFAwkDBQQGAwYDBgTfAw4DBwQFAwgDBAMJAw0DEQMEAwkDBQMIAwQDCAPgAw0CCQMFAgkDBQIIAw4EEQMDAwoCBQIJAwQDCAPgAw0DCAMEBAgDBAMJAg8CEgQCAwkDBAQIAwQDCATfBQEBCAMJAwUCCgIFAggDDwMTAwEDCQMFAgoCBAIKAuEIBgMJAwQDCQQDAwkDDgMUBgkDBAMJAwMECAPkBwUCCQMEAwoCBQIIAw8DFAYJAwQDCgIEAgoC6AQDAwkDBAMJAwQDCQIPAxMDAQMJAwQDCQMEAwgD6QMEAwgDBQMIAwUCCAMPAhMDAgMJAwUDCAMEAwgD6QMEAwgDBQMIAwUDBwQNAxIDAwMJAwUDCAMEAwgE6AMFAwYEBgMGAwYDBgQNBBEDBAMIBAYDBgMGAwYE4QEBAQQDBgUDBQYFAwMIBAIDAQIFAgEBAwQRAwUDAwECBgYFAwMHBQMF4AsHCAEDBwoICAEDBQoQBAYDAwUBAwcKCAgBA+IHCwUCAwkGDAUDAwYGEQQHAwIFAgMJBgwFAwL7ACUDKQP7AFcCKQP7AFYDKQP7AFcCKQP7AFYDKQP7AFcCKQP/AP8A/wD/AP8A/gB8AQECRAKSAaIFMQUOApECogUuCQ0CkgKgBDACBgIMApECdgMFBAUGCAYGBAYDCQYHAwUDDwILAg4FAwoGBAYJEQMDCgUHDgcCCgsCCQkHBQUDBgcDCjQEBQMECgQJBQMGBAcKBAUEAwYDAQMDAgoCDAgDCQQIBAoQBAMJBAkLCQMJCgIKCgQJAwQECAMKNQMFAwQDAQEBBAMFAQUEAwcDBgYBBAQGAwMECgICCgILBQIBBAEBBAEBBQMBBQMBAQEBBREEAgEBAQEBAQQDBQEECwMBAQICBQQOAgwDAQEFBQIDAwMEBAEBAQMDAQECAQQ1AwUEAwMKAwUEAwQFBAYDBQQEBQMDBAECAgMCAwIJAgsDDAMGBAMDCAMSAwkEAwMRBAwDDQINAwcECgEFAw4ENQQFAwMECQQFBAMDBwMGAwYDAwYDAwMCAgIEAgIBCgIKAwwDBwMEAwYEBQUHAQEECQMDAwkGAgQLBA4CDAQGAxEDDQQ3BAEBAQQEBgYDBwQCAwYEBQQGBAIDAQMCAwMCAgIDAgMCCQIKCAgDBgMEAwUEBgUECQQBAQEBBAMGBgYCBQsDDQINAwcDEQQLAzgNAwgEBAYDAwQGAwUEBgMEAwEDAQMDAgIDAgIDAQoCCgoFBAUEBAQDBAcBAQEBAQIKBAkECAQBAQEBAQQGCAMOAgwDBwQCAQEBBgEFBgYEOgsGBwMDBwMDAwYEBQQGBAIDAgMBAwMCAgcCAgoCCgQCBAYCBwMEAwMEDwQDBAMJBgcMBggDDQINBAcIBAMGBQYDOwMFAwoEAgQGAwMDBwMFBAYDAwQCBgQBAgICAQQCCgIKAwQDBQQGAwQDAwMQBAMDCQQKAwsDDAMOAgwDCQcEAwQECQM6BAUDCwMCBAUEAwQFBAYDBQQDAwMGBAIJAgsCCgQDAwYDBgMEAwMDEAMEBAkDCgMLAwsEDQINAw0DBAMEBAgEOwMFBAMCAQECAwQFAgQEAwIBAQEBBAEBAQECBQIEBQMDBQUDBQMMAgsDAwMFBAIBBAQBAwQFAgIKBAEBAQQCAQEBAQEBBAQCAQEBBAoFAwEHBAEBCwIMBAEBBAEBAQEBAQMLBAQBBAQDAjQEBQMECQUJBQMCDAMKBAMFBAYJDQILCAcGBAgFCAsJBAkECAwJBgYKAg0HBAgLCQQJNQMFAwUHCAYGAwIMBQYGBAQECAEBAhACDQUHBgcECAYNCQMJBQYPBgcFDAIMBgUIDQcGBqsCkQL/AFs=';
        const buffer = Buffer.from(fixture, 'base64');
        const results = await payload_decoder_1.default(buffer);
        expect(results.control.maximumIntensity).toEqual([0x1d, 0x44, 0x80]);
        expect(results.control.maximumPrinterSpeed).toEqual([
            0x1d,
            0x73,
            0x03,
            0xe8,
        ]);
        expect(results.control.peakCurrent).toEqual([0x1d, 0x2f, 0x0f]);
        expect(results.control.printerAcceleration).toEqual([0x1d, 0x61, 0xd0]);
        expect(results.rle.isCompressed).toBe(true);
        expect(results.rle.data.length).toBe(1583);
        expect(results.rle.length).toBe(1583);
        expect(results.metadata.pixelCount).toBe(59520);
    });
});
