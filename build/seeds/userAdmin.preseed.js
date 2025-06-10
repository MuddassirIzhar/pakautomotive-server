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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAdminSeed = void 0;
const app_data_source_1 = require("../app-data-source");
const user_entity_1 = require("../entities/user.entity");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userAdminSeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // await Manager.query("SET FOREIGN_KEY_CHECKS = 0; TRUNCATE table user; SET FOREIGN_KEY_CHECKS = 1;");
    // await Manager.query(`ALTER TABLE "user" DISABLE TRIGGER ALL; TRUNCATE TABLE "user" CASCADE; ALTER TABLE "user" ENABLE TRIGGER ALL;`);
    yield app_data_source_1.Manager.query(`TRUNCATE TABLE "user" CASCADE;`);
    const repository = app_data_source_1.Manager.getRepository(user_entity_1.User);
    const user = __rest(yield repository.save({
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: yield bcryptjs_1.default.hash("12345678", 10),
        role: {
            id: 1
        }
    }), []);
    const userData = yield repository.findOne({
        where: { id: user.id },
        relations: ['role.permissions']
    });
    if (!!userData) {
        const { password } = userData, user = __rest(userData, ["password"]);
        res.status(201).send({
            message: 'default admin user created',
            user,
            "credentials": {
                "email": user.email,
                "password": '12345678'
            }
        });
    }
});
exports.userAdminSeed = userAdminSeed;
