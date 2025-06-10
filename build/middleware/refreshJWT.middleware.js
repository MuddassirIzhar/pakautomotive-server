"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../controller/config/config"));
const logging_1 = __importDefault(require("../controller/config/logging"));
const signJWT_function_1 = __importDefault(require("../functions/signJWT.function"));
const NAMESPACE = "refresh JWT";
const { TokenExpiredError } = jsonwebtoken_1.default;
const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
    }
    return res.sendStatus(401).send({ message: "Unauthorized!" });
};
const refreshJWT = (req, res, next) => {
    logging_1.default.info(NAMESPACE, `Validating refresh token`);
    // res.send(req.cookies);
    console.log(req.cookies);
    const token = req.cookies.refreshToken;
    // const token = false;
    if (!token) {
        return res.status(401).json({
            message: 'Access Denied. No refresh token provided.'
        });
    }
    let secretKey = config_1.default.server.token.secret;
    jsonwebtoken_1.default.verify(token, secretKey, (error, decoded) => {
        if (error) {
            return catchError(error, res);
        }
        else {
            let user = decoded;
            let accessToken, refreshToken;
            // signJWT(user, 'access', (_error, result) => {
            //     if (_error) {
            //         res.status(500).send({
            //             message: "unable to sign JWT token"
            //         });
            //     }
            //     accessToken = result;
            //     res.status(200)
            //     .header('Authorization', accessToken)
            //     .send({
            //         user,
            //         accessToken
            //         });
            // });
            (0, signJWT_function_1.default)(user, 'access', (_error, result) => {
                if (_error) {
                    res.status(500).send({
                        message: "unable to sign JWT token"
                    });
                }
                accessToken = result;
                (0, signJWT_function_1.default)(user, 'refresh', (_error, _result) => {
                    if (_error) {
                        res.status(500).send({
                            message: "unable to sign JWT token"
                        });
                    }
                    refreshToken = _result;
                    res.status(200)
                        .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                        .header('Authorization', accessToken)
                        .send({
                        user,
                        refreshToken,
                        accessToken,
                        message: "successfully signed in"
                    });
                });
            });
        }
    });
};
exports.refreshJWT = refreshJWT;
