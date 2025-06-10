import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from "typeorm"

export const myDataSource = new DataSource(
    {
        type: "mysql",
        host: process.env.DS_HOST,
        port: 3306,
        username: process.env.DS_USER,
        password: process.env.DS_PASS,
        database: process.env.DS_DB,
        // entities: [process.env.DS_ENTITIES || './src/entities/*.{js,ts}'],
        // entities: [__dirname + '/../**/*.entity.{js,ts}'],
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        logging: false,
        synchronize: true,
        multipleStatements: true
    },
    // {
    //     type: "postgres",
    //     host: process.env.POSTGRES_HOST,
    //     port: 5432,
    //     username: process.env.POSTGRES_USER,
    //     password: process.env.POSTGRES_PASSWORD,
    //     database: process.env.POSTGRES_DATABASE,
    //     // entities: ['./src/entities/*.{js,ts}'],
    //     // entities: [`${__dirname}/**/entities/*.{ts,js}`],
    //     // migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
    //     entities: [process.env.DS_ENTITIES || './build/src/entities/*.{js,ts}'],
    //     migrations: [process.env.DS_MIGRATIONS || './build/src/migrations/*.{js,ts}'],
    //     synchronize: true,
    //     logging: false,
    //     ssl: true
    //   }
      
)


export const Manager = myDataSource.manager