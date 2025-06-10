import dotenv from "dotenv";

dotenv.config();


const MYSQL_HOST = process.env.MYSQL_HOST || '127.0.0.1';
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '12345678';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'testdb';
const MYSQL_MAX = process.env.MYSQL_MAX || 5;
const MYSQL_MIN = process.env.MYSQL_MIN || 0;
const MYSQL_ACQUIRE = process.env.MYSQL_ACQUIRE || 30000;
const MYSQL_IDLE = process.env.MYSQL_IDLE || 10000;
const MYSQL = {
    HOST: MYSQL_HOST,
    USER: MYSQL_USER,
    PASSWORD: MYSQL_PASSWORD,
    DB: MYSQL_DATABASE,
    pool: {
      max: MYSQL_MAX,
      min: MYSQL_MIN,
      acquire: MYSQL_ACQUIRE,
      idle: MYSQL_IDLE
    }
  };
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 300;
const SERVER_TOKEN_EXPIRETIME_REFRESH = process.env.SERVER_TOKEN_EXPIRETIME_REFRESH || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "FusiOn 92 Issuer";
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || "NQILua/fWC9a0UQw68IGEc9HrNKRgMOYm/p84N2rjn0=";
const SERVER_TOKEN_ALGORITHM = process.env.SERVER_TOKEN_ALGORITHM || "HS256";

const SERVER = {
    hostname : SERVER_HOSTNAME,
    port : SERVER_PORT,
    token: {
        expireTime : SERVER_TOKEN_EXPIRETIME,
        expireTimeRefresh : SERVER_TOKEN_EXPIRETIME_REFRESH,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET,
        algorithm: SERVER_TOKEN_ALGORITHM
    }
}

const config = {
    server: SERVER,
    mysql: MYSQL,
}

export default config;