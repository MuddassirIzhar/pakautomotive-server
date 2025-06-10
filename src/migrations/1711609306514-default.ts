import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1711609306514 implements MigrationInterface {
    name = 'Default1711609306514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "role_id" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" SERIAL NOT NULL, "sender_delete" boolean NOT NULL DEFAULT false, "sender_count" integer NOT NULL DEFAULT '0', "receiver_delete" boolean NOT NULL DEFAULT false, "receiver_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "sender_id" integer, "receiver_id" integer, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "sender_delete" boolean NOT NULL DEFAULT false, "receiver_delete" boolean NOT NULL DEFAULT false, "message" text NOT NULL, "file_type" character varying, "file" character varying, "type" character varying NOT NULL DEFAULT 'text', "status" character varying NOT NULL DEFAULT 'sent', "read_at" TIMESTAMP DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP DEFAULT now(), "room_id" integer, "sender_id" integer, "receiver_id" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "total" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "product_title" character varying NOT NULL, "price" integer NOT NULL DEFAULT '0', "quantity" integer NOT NULL DEFAULT '0', "order_id" integer, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "patient_care_team" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "patient_id" integer, "user_id" integer, CONSTRAINT "PK_b63062fa2cc34d73b60b25aba77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "patient" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "dob" character varying NOT NULL, "address" character varying NOT NULL, "anotherAddress" character varying NOT NULL, "details" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "creator_id" integer, CONSTRAINT "PK_8dfa510bb29ad31ab2139fbfb99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "patient_medical_records" ("id" SERIAL NOT NULL, "file" text NOT NULL, "file_type" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "patient_id" integer, CONSTRAINT "PK_fe4328366dde7c29f6e09975b96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "alert" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "time" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "patient_id" integer, "creator_id" integer, CONSTRAINT "PK_ad91cad659a3536465d564a4b2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reminder" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "time" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "patient_id" integer, "creator_id" integer, CONSTRAINT "PK_9ec029d17cb8dece186b9221ede" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."todo_priority_enum" AS ENUM('high', 'medium', 'low')`);
        await queryRunner.query(`CREATE TABLE "todo" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "priority" "public"."todo_priority_enum" NOT NULL DEFAULT 'low', "waitlist" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "patient_id" integer, "user_id" integer, "creator_id" integer, CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying NOT NULL, "price" integer NOT NULL, CONSTRAINT "UQ_f7bf944ad9f1034110e8c2133ab" UNIQUE ("title"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_a8b355ffde411943a8ee943279e" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_2bc66fa28a47601b9107026b387" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_a9edf3bbd4fc17c42ee8677b9ce" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_f4da40532b0102d51beb220f16a" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_care_team" ADD CONSTRAINT "FK_8909d0a1197b3582ca908aaee55" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_care_team" ADD CONSTRAINT "FK_65aa634f8ec14eea7a76483ccf2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_5fcd2044ffc679b13ede9d240c3" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_medical_records" ADD CONSTRAINT "FK_b9072cb40efcdf8a8eb0d6d3433" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "alert" ADD CONSTRAINT "FK_0f27c8f6e23377208572a954c89" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "alert" ADD CONSTRAINT "FK_124a6dc176261fb3db2d35fd66a" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reminder" ADD CONSTRAINT "FK_a31546c4b3b1ae2590828d028c8" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reminder" ADD CONSTRAINT "FK_1667781b02f06173f250b4f47d7" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todo" ADD CONSTRAINT "FK_e00c5359e8d01aed4132d076cbb" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todo" ADD CONSTRAINT "FK_9cb7989853c4cb7fe427db4b260" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todo" ADD CONSTRAINT "FK_37dce6929b176717c7ee0b4b529" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_37dce6929b176717c7ee0b4b529"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_9cb7989853c4cb7fe427db4b260"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_e00c5359e8d01aed4132d076cbb"`);
        await queryRunner.query(`ALTER TABLE "reminder" DROP CONSTRAINT "FK_1667781b02f06173f250b4f47d7"`);
        await queryRunner.query(`ALTER TABLE "reminder" DROP CONSTRAINT "FK_a31546c4b3b1ae2590828d028c8"`);
        await queryRunner.query(`ALTER TABLE "alert" DROP CONSTRAINT "FK_124a6dc176261fb3db2d35fd66a"`);
        await queryRunner.query(`ALTER TABLE "alert" DROP CONSTRAINT "FK_0f27c8f6e23377208572a954c89"`);
        await queryRunner.query(`ALTER TABLE "patient_medical_records" DROP CONSTRAINT "FK_b9072cb40efcdf8a8eb0d6d3433"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_5fcd2044ffc679b13ede9d240c3"`);
        await queryRunner.query(`ALTER TABLE "patient_care_team" DROP CONSTRAINT "FK_65aa634f8ec14eea7a76483ccf2"`);
        await queryRunner.query(`ALTER TABLE "patient_care_team" DROP CONSTRAINT "FK_8909d0a1197b3582ca908aaee55"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_e9674a6053adbaa1057848cddfa"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_f4da40532b0102d51beb220f16a"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_a9edf3bbd4fc17c42ee8677b9ce"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_2bc66fa28a47601b9107026b387"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_a8b355ffde411943a8ee943279e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "todo"`);
        await queryRunner.query(`DROP TYPE "public"."todo_priority_enum"`);
        await queryRunner.query(`DROP TABLE "reminder"`);
        await queryRunner.query(`DROP TABLE "alert"`);
        await queryRunner.query(`DROP TABLE "patient_medical_records"`);
        await queryRunner.query(`DROP TABLE "patient"`);
        await queryRunner.query(`DROP TABLE "patient_care_team"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "permission"`);
    }

}
