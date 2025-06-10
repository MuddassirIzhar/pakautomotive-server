export declare const config: {
    HOST: string;
    USER: string;
    PASSWORD: string;
    DB: string;
    pool: {
        max: number;
        min: number;
        acquire: number;
        idle: number;
    };
};
export declare const dialect = "mysql";
