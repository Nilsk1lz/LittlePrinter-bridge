"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// wrapper for static function missing in interfaces
exports.default = (handler, configuration = undefined) => {
    return handler.areParametersValid(configuration);
};
