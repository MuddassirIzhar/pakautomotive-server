import jwt from "jsonwebtoken";
import config from "../controller/config/config";
import logging from "../controller/config/logging";
import { User } from "../entities/user.entity";

const NAMESPACE = "sign JWT";

const signJWT = (user: User, secretType: string, callback: (error: Error | null | unknown, token: string | null) => void): void => {

    console.log(secretType)
    let secret = config.server.token.secret;
    let expireTime = config.server.token.expireTime;
    if(secretType == 'refresh'){
        expireTime = config.server.token.expireTimeRefresh;
    }

    var expirationTimeInSeconds = Number(expireTime);
    // var timeSinceEpoch = new Date().getTime();
    // var expirationTime = timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
    // var expirationTimeInSeconds = Math.floor(expirationTime / 1000);
    logging.info(NAMESPACE, `Attempting to sign token for ${user.firstName} ${user.lastName} and expiration time in seconds ${expirationTimeInSeconds}`);
    try
    {   
        jwt.sign(
            {
                user
            }, 
            // config.server.token.secret,
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