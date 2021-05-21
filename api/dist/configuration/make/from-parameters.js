"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// wrapper for static function missing in interfaces
exports.default = (handler, parameters = undefined) => {
    return handler.fromParameters(parameters);
};
