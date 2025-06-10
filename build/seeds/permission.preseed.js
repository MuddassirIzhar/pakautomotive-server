"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionSeed = void 0;
const app_data_source_1 = require("../app-data-source");
const permission_entity_1 = require("../entities/permission.entity");
const permissionSeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // await Manager.query("SET FOREIGN_KEY_CHECKS = 0; TRUNCATE table permission; TRUNCATE table role; SET FOREIGN_KEY_CHECKS = 1;");
    const entities = app_data_source_1.Manager.connection.entityMetadatas;
    // await Manager.query("SET FOREIGN_KEY_CHECKS = 0;");
    for (const entity of entities) {
        // console.log(entity.tableName);
        yield app_data_source_1.Manager.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
        // await Manager.query(`ALTER table ${entity.tableName} DISABLE TRIGGER ALL;`);
        // const repository = Manager.getRepository(entity.name);
        // await repository.clear();
        // await Manager.query(`ALTER table ${entity.tableName} ENABLE TRIGGER ALL;`);
    }
    // await Manager.query("SET FOREIGN_KEY_CHECKS = 1;");
    // create default permissions
    const permissionRepository = app_data_source_1.Manager.getRepository(permission_entity_1.Permission);
    const perms = [
        'view_users',
        'edit_users',
        'view_roles',
        'edit_roles',
        'view_products',
        'edit_products',
        'view_orders',
        'edit_orders'
    ];
    let permissions = [];
    // insert permissions into Permission table
    for (let i = 0; i < perms.length; i++) {
        permissions.push(yield permissionRepository.save({ name: perms[i] }));
    }
    // const allPerms = await Manager.getRepository(Permission).find({
    //     select: ["name"]
    // });
    res.status(201).send({
        message: 'default user permissions created',
        perms
    });
});
exports.permissionSeed = permissionSeed;
