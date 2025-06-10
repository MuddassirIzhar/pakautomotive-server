import jwt from "jsonwebtoken";
import { User } from "../../entities/user.entity";
import config from "../config/config";
import logging from "../config/logging";

const NAMESPACE = "sign JWT";

const signJWT = (user: User, secretType: string, callback: (error: Error | null | unknown, token: string | null) => void): void => {

    console.log(secretType)
    let secret = config.server.token.secret;
    let expireTime = config.server.token.expireTime;
    if(secretType == 'refresh'){
        expireTime = config.server.token.expireTimeRefresh;
    }

    var expirationTimeInSeconds = Number(expireTime);
    logging.info(NAMESPACE, `Attempting to sign token for ${user.firstName} and expiration time in seconds ${expirationTimeInSeconds}`);
    try
    {   
        jwt.sign(
            {
                user
            }, 
            secret, 
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: expirationTimeInSeconds
            },
            (error, token) => {
                if (error) {
                    callback(error, null);
                } else if (token) {
                    callback(null, token);
                }
            }
        );

    }
    catch (error: unknown) {
        if (typeof error === "string") {
            logging.error(NAMESPACE, error.toUpperCase(), error);
            callback(error, null);
        } else if (error instanceof Error) {
            logging.error(NAMESPACE, error.message, error);
            callback(error, null);
        }
    }
}

export default signJWT;