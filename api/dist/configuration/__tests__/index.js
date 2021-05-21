"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const path_1 = __importDefault(require("path"));
const bridge_1 = __importDefault(require("../../berger/bridge"));
describe('configuration', () => {
    it('parses config', async () => {
        const path = path_1.default.join(__dirname, '../parse/__tests__/__data__/reference.json');
        const result = await index_1.default(path);
        expect(result).toBeInstanceOf(bridge_1.default);
    });
    it('fails on missing file', () => {
        const path = path_1.default.join(__dirname, '__data__', 'missing.file');
        expect(async () => {
            await index_1.default(path);
        }).rejects.toThrow();
    });
});
