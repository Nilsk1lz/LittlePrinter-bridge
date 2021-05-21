"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const printable_image_1 = __importDefault(require("./printable-image"));
const unrle_1 = __importDefault(require("../berger/device/printer/unrle"));
class PrintableImageWrapper {
    constructor(handler) {
        this.handler = handler;
    }
    print(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const bits = yield (() => __awaiter(this, void 0, void 0, function* () {
                if (payload.rle.isCompressed) {
                    return yield unrle_1.default(payload.rle.data);
                }
                else {
                    return Buffer.from(payload.rle.data);
                }
            }))();
            const image = printable_image_1.default.fromBits(bits);
            return yield this.handler.print(image, payload);
        });
    }
}
exports.default = PrintableImageWrapper;
//# sourceMappingURL=printable-image-wrapper.js.map