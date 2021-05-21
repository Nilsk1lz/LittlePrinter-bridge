"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_1 = __importDefault(require("../json"));
const path_1 = __importDefault(require("path"));
const reference_json_1 = __importDefault(require("./__data__/reference.json"));
describe('json', () => {
    it('reads good file', async () => {
        const path = path_1.default.join(__dirname, '__data__', 'good.json');
        const result = await json_1.default(path);
        expect(result).toEqual(reference_json_1.default);
    });
    it('rejects bad file', async () => {
        const path = path_1.default.join(__dirname, '__data__', 'bad.json');
        expect(async () => {
            await json_1.default(path);
        }).rejects.toThrow();
    });
});
