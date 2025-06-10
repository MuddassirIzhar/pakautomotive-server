"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../controller/config/config"));
const logging_1 = __importDefault(require("../controller/config/logging"));
const NAMESPACE = "extract JWT";
const { TokenExpiredError } = jsonwebtoken_1.default;
const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
    }
    return res.status(401).send({ message: "Unauthorized!" });
};
const extractJWT = (req, res, next) => {
    var _a;
    logging_1.default.info(NAMESPACE, `Validating token`);
    let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).send({
            message: 'No token'
        });
    }
    jsonwebtoken_1.default.verify(token, config_1.default.server.token.secret, (error, decoded) => {
        if (error) {
            return catchError(error, res);
        }
        else {
            logging_1.default.info(NAMESPACE, `Token validated, user authorizated`);
            res.locals.jwt = decoded;
            next();
        }
    });
};
exports.default = extractJWT;
