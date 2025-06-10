import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import config from "../controller/config/config";
import logging from "../controller/config/logging";
import signJWT from "../functions/signJWT.function";

const NAMESPACE = "refresh JWT";
const { TokenExpiredError } = jwt;

const catchError = (err: any, res: any) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
    }

    return res.sendStatus(401).send({ message: "Unauthorized!" });
}

export const refreshJWT: RequestHandler = (req, res, next) => {
    logging.info(NAMESPACE, `Validating refresh token`);
    // res.send(req.cookies);
    console.log(req.cookies)
    const token = req.cookies.refreshToken;
    // const token = false;
    if (!token) {
        return res.status(401).json({
            message: 'Access Denied. No refresh token provided.'
        });
    }
    let secretKey = config.server.token.secret;

    jwt.verify(token, secretKey, (error: any, decoded: any) => {
        if (error) {
            return catchError(error, res);
        }
        else {
            let user = decoded;

            let accessToken: any, refreshToken: any;
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

            signJWT(user, 'access', (_error, result) => {
                if (_error) {
                    res.status(500).send({
                        message: "unable to sign JWT token"
                    });
                }
                accessToken = result;
                signJWT(user, 'refresh', (_error, _result) => {
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
                            message:"successfully signed in"
                        });
                });
            });
        }
    });
};
