import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Default1711609306514 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
