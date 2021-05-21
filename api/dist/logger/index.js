"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.splat(), winston_1.default.format.timestamp(), winston_1.default.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)),
});
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston_1.default.transports.File({
        filename: 'error.log',
        level: 'error',
    }));
    logger.add(new winston_1.default.transports.File({
        filename: 'combined.log',
        level: 'info',
    }));
}
else {
    logger.level = 'debug';
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), logger.format),
    }));
}
exports.default = logger;
