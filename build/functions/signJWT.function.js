"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../controller/config/config"));
const logging_1 = __importDefault(require("../controller/config/logging"));
const NAMESPACE = "sign JWT";
const signJWT = (user, secretType, callback) => {
    console.log(secretType);
    let secret = config_1.default.server.token.secret;
    let expireTime = config_1.default.server.token.expireTime;
    if (secretType == 'refresh') {
        expireTime = config_1.default.server.token.expireTimeRefresh;
    }
    var expirationTimeInSeconds = Number(expireTime);
    // var timeSinceEpoch = new Date().getTime();
    // var expirationTime = timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
    // var expirationTimeInSeconds = Math.floor(expirationTime / 1000);
    logging_1.default.info(NAMESPACE, `Attempting to sign token for ${user.firstName} ${user.lastName} and expiration time in seconds ${expirationTimeInSeconds}`);
    try {
        jsonwebtoken_1.default.sign({
            user
        }, 
        // config.server.token.secret,
        secret, {
            issuer: config_1.default.server.token.issuer,
            algorithm: 'HS256',
            expiresIn: expirationTimeInSeconds
        }, (error, token) => {
            if (error) {
                callback(error, null);
            }
            else if (token) {
                callback(null, token);
            }
        });
    }
    catch (error) {
        if (typeof error === "string") {
            logging_1.default.error(NAMESPACE, error.toUpperCase(), error);
            callback(error, null);
        }
        else if (error instanceof Error) {
            logging_1.default.error(NAMESPACE, error.message, error);
            callback(error, null);
        }
    }
};
exports.default = signJWT;
