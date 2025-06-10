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
exports.CheckAuthState = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const app_data_source_1 = require("../app-data-source");
const user_entity_1 = require("../entities/user.entity");
const secret = process.env.SECRET_KEY || 'NQILua/fWC9a0UQw68IGEc9HrNKRgMOYm/p84N2rjn0=';
const repository = app_data_source_1.myDataSource.getRepository(user_entity_1.User);
const CheckAuthState = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get cookie from authenticated user
        // const jwt = req.cookies['jwt'];
        const jwt = req.cookies['refreshToken'];
        // get user id from jwt
        const payload = (0, jsonwebtoken_1.verify)(jwt, secret);
        if (!payload) {
            return res.status(401).send({
                message: 'ERROR :: User unauthenticated!'
            });
        }
        // return user info  for user id
        // req['user'] = await repository.findOneBy(payload.id)
        const id = payload.user.id;
        req['user'] = yield repository.findOne({
            where: {
                id: id
            },
            relations: {
                role: {
                    permissions: true
                },
            },
        });
        next();
    }
    catch (e) {
        return res.status(401).send({
            message: 'ERROR :: User unauthenticated!'
        });
    }
});
exports.CheckAuthState = CheckAuthState;
