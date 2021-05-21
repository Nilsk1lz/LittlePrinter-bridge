"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const make_1 = __importDefault(require("../make"));
const bridge_1 = __importDefault(require("../../berger/bridge"));
const reference_json_1 = __importDefault(require("../parse/__tests__/__data__/reference.json"));
describe('make', () => {
    it('parses config', async () => {
        const result = await make_1.default(reference_json_1.default);
        expect(result).toBeInstanceOf(bridge_1.default);
    });
    it('fails on bad configuration', () => {
        expect(async () => {
            await make_1.default({});
        }).rejects.toThrow();
    });
});
