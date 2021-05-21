"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_1 = __importDefault(require("../js"));
const path_1 = __importDefault(require("path"));
const reference_json_1 = __importDefault(require("./__data__/reference.json"));
describe('js', () => {
    it('reads good file', async () => {
        const path = path_1.default.join(__dirname, '__data__', 'good.js');
        const result = await js_1.default(path);
        expect(result).toEqual(reference_json_1.default);
    });
    it('rejects bad file', async () => {
        const path = path_1.default.join(__dirname, '__data__', 'bad.js');
        expect(async () => {
            await js_1.default(path);
        }).rejects.toThrow();
    });
});
