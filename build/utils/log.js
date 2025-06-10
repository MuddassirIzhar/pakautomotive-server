"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
function log(message) {
    if (process.env.DEBUG === "true")
        console.log(message);
}
exports.log = log;
