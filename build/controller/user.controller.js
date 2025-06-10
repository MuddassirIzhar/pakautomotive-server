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
exports.DeleteUser = exports.UpdateUser = exports.CreateUser = exports.GetUser = exports.GetUsers = void 0;
const app_data_source_1 = require("../app-data-source");
const user_entity_1 = require("../entities/user.entity");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const repository = app_data_source_1.myDataSource.getRepository(user_entity_1.User);
const GetUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    const role = req.query.role;
    // pagination
    // only retrieve 15 items per page
    const take = parseInt(req.query.take || '15');
    const page = parseInt(req.query.page || '1');
    // find 'take' number of items starting from zero or (page-1)*take
    // const [data, total] = await repository.findAndCount({
    const [data, total] = yield repository.findAndCount({
        // where: {
        //     id: Not(user.id),
        // },
        where: {
            role: {
                id: role
            }
        },
        take: take,
        skip: (page - 1) * take,
        relations: ['role.permissions']
    });
    res.send({
        data: data.map(user => {
            const { password } = user, data = __rest(user, ["password"]);
            return data;
        }),
        // also return active page, last page and total number of items
        meta: {
            total,
            page,
            last_page: Math.ceil(total / take)
        }
    });
});
exports.GetUsers = GetUsers;
const GetUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userData = yield repository.findOne({
        where: { id: id },
        relations: ['role']
    });
    if (!!userData) {
        const { password } = userData, user = __rest(userData, ["password"]);
        res.send({ user });
    }
});
exports.GetUser = GetUser;
const CreateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists in db
    const existingUser = yield repository.findOneBy({
        email: req.body.email
    });
    // if does not exists break
    if (existingUser) {
        return res.status(409).send({
            message: 'User aleady exists!'
        });
    }
    const _a = req.body, { role } = _a, body = __rest(_a, ["role"]);
    const hashedPassword = yield bcryptjs_1.default.hash(body.password, 10);
    const _b = yield repository.save(Object.assign(Object.assign({}, body), { password: hashedPassword, role: {
            id: role
        } })), { password } = _b, user = __rest(_b, ["password"]);
    // res.status(201).send(user)
    return res.status(201).json({
        message: 'User Created Successfully!'
    });
});
exports.CreateUser = CreateUser;
const UpdateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists in db
    const userCheck = yield repository.findOneBy({
        email: req.body.email
    });
    const id = parseInt(req.params.id);
    // if does not exists break
    if (userCheck && userCheck.id !== id) {
        return res.status(404).send({
            message: 'ERROR :: Email not available!'
        });
    }
    const _c = req.body, { role, passwordConfirmation } = _c, body = __rest(_c, ["role", "passwordConfirmation"]);
    const update = yield repository.update(req.params.id, Object.assign(Object.assign({}, body), { role: {
            id: role
        } }));
    return res.status(202).json({
        message: 'User Updated Successfully!'
    });
    // const userData = await repository.findOne({ 
    //     where: { id: id },
    //     relations: ['role']
    // })
    // if (!!userData) {
    //     const { password, ...user } = userData;
    //     res.status(202).send(user)
    // }
    // res.status(202).send(update)
});
exports.UpdateUser = UpdateUser;
const DeleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteUser = yield repository.delete(req.params.id);
    return res.status(200).json({
        message: 'User Deleted Successfully!',
    });
    // res.status(204).send(deleteUser)
    res.status(200).send(deleteUser);
});
exports.DeleteUser = DeleteUser;
