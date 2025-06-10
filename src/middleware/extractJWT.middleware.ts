import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import config from "../controller/config/config";
import logging from "../controller/config/logging";

const NAMESPACE = "extract JWT";
const { TokenExpiredError } = jwt;

const catchError = (err: any, res: any) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
    }

    return res.status(401).send({ message: "Unauthorized!" });
}
const extractJWT: RequestHandler = (req, res, next) => {
    logging.info(NAMESPACE, `Validating token`);
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) {

        return res.status(401).send({
            message: 'No token'
        })
    }
    jwt.verify(token, config.server.token.secret, (error, decoded) => {
        if (error) {
            return catchError(error, res);
        }
        else {
            logging.info(NAMESPACE, `Token validated, user authorizated`);
            res.locals.jwt = decoded;
            next();
        }
    });
};

export default extractJWT;