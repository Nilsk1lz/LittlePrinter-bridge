"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const path_1 = __importDefault(require("path"));
const reference_json_1 = __importDefault(require("./__data__/reference.json"));
describe('parse', () => {
    it('reads js', async () => {
        const path = path_1.default.join(__dirname, '__data__', 'good.js');
        expect(await index_1.default(path)).toEqual(reference_json_1.default);
    });
    it('reads json', async () => {
        const path = path_1.default.join(__dirname, '__data__', 'good.json');
        expect(await index_1.default(path)).toEqual(reference_json_1.default);
    });
    it('reads yaml', async () => {
        const path = path_1.default.join(__dirname, '__data__', 'good.yaml');
        expect(await index_1.default(path)).toEqual(reference_json_1.default);
    });
    it('rejects unknown extention', async () => {
        const path = path_1.default.join(__dirname, '__data__', 'unknown.md');
        expect(async () => {
            await index_1.default(path);
        }).rejects.toThrow();
    });
    it('rejects on missing file', async () => {
        const path = path_1.default.join(__dirname, '__data__', 'foo.bar.baz.quux');
        expect(async () => {
            await index_1.default(path);
        }).rejects.toThrow();
    });
});
