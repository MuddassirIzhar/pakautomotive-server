declare const config: {
    server: {
        hostname: string;
        port: string | number;
        token: {
            expireTime: string | number;
            expireTimeRefresh: string | number;
            issuer: string;
            secret: string;
            algorithm: string;
        };
    };
    mysql: {
        HOST: string;
        USER: string;
        PASSWORD: string;
        DB: string;
        pool: {
            max: string | number;
            min: string | number;
            acquire: string | number;
            idle: string | number;
        };
    };
};
export default config;
