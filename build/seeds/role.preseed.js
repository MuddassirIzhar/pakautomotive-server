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
exports.roleSeed = void 0;
const app_data_source_1 = require("../app-data-source");
const permission_entity_1 = require("../entities/permission.entity");
const role_entity_1 = require("../entities/role.entity");
const roleSeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // await Manager.query("SET FOREIGN_KEY_CHECKS = 0; TRUNCATE table role; SET FOREIGN_KEY_CHECKS = 1;");
    // await Manager.query(`ALTER TABLE "role" DISABLE TRIGGER ALL; TRUNCATE TABLE "role" CASCADE; ALTER TABLE "role" ENABLE TRIGGER ALL;`);
    yield app_data_source_1.Manager.query(`TRUNCATE TABLE "role" CASCADE;`);
    // create role permissions
    const permissionRepository = app_data_source_1.Manager.getRepository(permission_entity_1.Permission);
    const allPerms = yield permissionRepository.find();
    // assign permissions to roles
    const roleRepository = app_data_source_1.Manager.getRepository(role_entity_1.Role);
    // admin gets all the permissions
    yield roleRepository.save({
        name: 'Admin',
        permissions: allPerms
    });
    // client is not allowed to edit roles
    delete allPerms[3];
    yield roleRepository.save({
        name: 'Client',
        permissions: allPerms
    });
    // professional cannot edit at all
    delete allPerms[1];
    delete allPerms[5];
    delete allPerms[7];
    yield roleRepository.save({
        name: 'Professional',
        permissions: allPerms
    });
    res.status(201).send({
        message: 'default user roles created', allPerms
    });
});
exports.roleSeed = roleSeed;
