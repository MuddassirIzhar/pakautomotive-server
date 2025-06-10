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
exports.ValidateRefreshToken = exports.UpdateUserEmail = exports.UpdateUserPass = exports.UpdateUserInfo = exports.Logout = exports.AuthenticatedUser = exports.Login = exports.Register = void 0;
// import Manager from '../db-connector';
// import { getRepository } from "typeorm";
const user_entity_1 = require("../entities/user.entity");
const register_validation_1 = require("../validation/register.validation");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import dataSource from "../db-connector";
// import { getRepository } from 'typeorm';
const app_data_source_1 = require("../app-data-source");
const jsonwebtoken_1 = require("jsonwebtoken");
const signJWT_function_1 = __importDefault(require("../functions/signJWT.function"));
// import signJWT from './functions/signJWT.function';
const secret = process.env.SECRET_KEY || 'NQILua/fWC9a0UQw68IGEc9HrNKRgMOYm/p84N2rjn0=';
const repository = app_data_source_1.Manager.getRepository(user_entity_1.User);
// REGISTER USER
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    // check if all infos were send
    const { error } = register_validation_1.registerValidation.validate(body);
    // break if something is missing
    if (error) {
        return res.status(400).send(error.details);
    }
    // verify that password is confirmed
    if (body.password !== body.passwordConfirmation) {
        return res.status(400).send({
            message: 'ERROR :: Passwords do not match!'
        });
    }
    // check if user exists in db
    const existingUser = yield repository.findOneBy({
        email: req.body.email
    });
    // if does not exists break
    if (existingUser) {
        return res.status(404).send({
            message: 'User aleady exists!'
        });
    }
    // save user to database
    const _a = yield repository.save({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: yield bcryptjs_1.default.hash(body.password, 10),
        role: {
            id: 1
        }
    }), { password } = _a, user = __rest(_a, ["password"]);
    return res.status(201).json({
        message: 'You have registered successfully!'
    });
    res.send(user);
});
exports.Register = Register;
// LOGIN USER
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists in db
    // const user = await repository.findOneBy(
    //     {
    //         email: req.body.email
    //     }
    // )
    const user = yield repository.findOne({
        select: ['id', 'firstName', 'lastName', 'email', 'password'],
        where: { email: req.body.email },
    });
    // if does not exists break
    if (!user) {
        return res.status(404).send({
            message: 'ERROR :: User does not exists!'
        });
    }
    if (user) {
        bcryptjs_1.default.compare(req.body.password, user.password, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                res.status(500).send({
                    message: error.message
                });
            }
            else if (result) {
                let accessToken, refreshToken;
                const payload = { id: user.id };
                const token = (0, jsonwebtoken_1.sign)(payload, secret);
                (0, signJWT_function_1.default)(user, 'access', (_error, result) => {
                    if (_error) {
                        res.status(500).send({
                            message: "unable to sign JWT token"
                        });
                    }
                    accessToken = result;
                    (0, signJWT_function_1.default)(user, 'refresh', (_error, _result) => {
                        if (_error) {
                            res.status(500).send({
                                message: "unable to sign JWT token"
                            });
                        }
                        refreshToken = _result;
                        res.status(200)
                            // .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                            .cookie('refreshToken', refreshToken, {
                            secure: true,
                            httpOnly: true,
                            sameSite: 'none',
                            // domain:"pakautomotive.com"
                        })
                            //.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'strict' })
                            //.header('Authorization', accessToken)
                            .send({
                            user,
                            refreshToken,
                            accessToken,
                            message: "successfully signed in"
                        });
                    });
                });
            }
            else {
                res.status(401).send({
                    message: `Invalid credentials`
                });
            }
        }));
    }
    else {
        res.status(401).send({
            message: `Invalid credentials`
        });
    }
    // // if exists but password is wrong break
    // if (!await bcryptjs.compare(req.body.password, user.password)) {
    //     return res.status(404).send({
    //         message: 'ERROR :: Invalid credentials!'
    //     })
    // }
    // // return JWT to authenticated user
    // const payload = { id: user.id }
    // const token = sign(payload, secret)
    // res.cookie('jwt', token, {
    //     // keep cookie in node.js backend
    //     httpOnly: true,
    //     maxAge: 24 * 60 * 60 * 1000 //1day
    // })
    // res.send({
    //     message: 'INFO :: Successfully logged in.'
    // })
    // // don't return password after successful login
    // // const { password, ...data } = user;
    // res.send(token);
    // // // don't return password after successful login
    // // const { password, ...data } = user;
    // // res.send(user);
});
exports.Login = Login;
const AuthenticatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _b = req['user'], { password } = _b, user = __rest(_b, ["password"]);
    // const user = req['user']
    res.send(user);
});
exports.AuthenticatedUser = AuthenticatedUser;
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // res.cookie('jwt', '', { maxAge: 0 })
    res.cookie('refreshToken', '', { maxAge: 0 });
    res.send({
        message: 'INFO :: Successfully logged out.'
    });
});
exports.Logout = Logout;
// UPDATE USER INFO
const UpdateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    if (!req.body.firstName) {
        return res.status(400).send({
            message: 'ERROR :: First Name is required!'
        });
    }
    if (!req.body.lastName) {
        return res.status(400).send({
            message: 'ERROR :: Last Name is required!'
        });
    }
    let accessToken, refreshToken;
    (0, signJWT_function_1.default)(user, 'access', (_error, result) => {
        if (_error) {
            res.status(500).send({
                message: "unable to sign JWT token"
            });
        }
        accessToken = result;
        (0, signJWT_function_1.default)(user, 'refresh', (_error, _result) => __awaiter(void 0, void 0, void 0, function* () {
            if (_error) {
                res.status(500).send({
                    message: "unable to sign JWT token"
                });
            }
            refreshToken = _result;
            try {
                yield repository.update(user.id, req.body);
                const userData = yield repository.findOneBy(user.id);
                if (!!userData) {
                    const { password } = userData, data = __rest(userData, ["password"]);
                    res.status(200)
                        // .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                        .cookie('refreshToken', refreshToken, {
                        secure: true,
                        httpOnly: false,
                        sameSite: 'none',
                        // domain:"pakautomotive.com"
                    })
                        //.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'strict' })
                        //.header('Authorization', accessToken)
                        .send({
                        user: data,
                        refreshToken,
                        accessToken,
                        message: "info updated successfully"
                    });
                }
            }
            catch (e) {
                res.status(500).send({
                    message: e
                });
            }
        }));
    });
});
exports.UpdateUserInfo = UpdateUserInfo;
// UPDATE USER PASSWORD
const UpdateUserPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    // verify that password is confirmed
    if (req.body.password !== req.body.passwordConfirmation) {
        return res.status(400).send({
            message: 'ERROR :: Passwords do not match!'
        });
    }
    bcryptjs_1.default.compare(req.body.currentPassword, user.password, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            res.status(500).send({
                message: error.message
            });
        }
        else if (result) {
            let accessToken, refreshToken;
            (0, signJWT_function_1.default)(user, 'access', (_error, result) => {
                if (_error) {
                    res.status(500).send({
                        message: "unable to sign JWT token"
                    });
                }
                accessToken = result;
                (0, signJWT_function_1.default)(user, 'refresh', (_error, _result) => __awaiter(void 0, void 0, void 0, function* () {
                    if (_error) {
                        res.status(500).send({
                            message: "unable to sign JWT token"
                        });
                    }
                    refreshToken = _result;
                    try {
                        yield repository.update(user.id, {
                            password: yield bcryptjs_1.default.hash(req.body.password, 10)
                        });
                        const userData = yield repository.findOneBy(user.id);
                        if (!!userData) {
                            const { password } = userData, data = __rest(userData, ["password"]);
                            res.status(200)
                                // .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                                .cookie('refreshToken', refreshToken, {
                                secure: true,
                                httpOnly: false,
                                sameSite: 'none',
                                // domain:"pakautomotive.com"
                            })
                                //.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'strict' })
                                //.header('Authorization', accessToken)
                                .send({
                                user: data,
                                refreshToken,
                                accessToken,
                                message: "email updated successfully"
                            });
                        }
                    }
                    catch (e) {
                        res.status(500).send({
                            message: e
                        });
                    }
                }));
            });
        }
        else {
            res.status(401).send({
                message: `Invalid current password`
            });
        }
    }));
});
exports.UpdateUserPass = UpdateUserPass;
// UPDATE USER PASSWORD
const UpdateUserEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    // check if user exists in db
    const userCheck = yield repository.findOneBy({
        email: req.body.email
    });
    // if does not exists break
    if (userCheck && userCheck.id !== user.id) {
        return res.status(404).send({
            message: 'ERROR :: Email not available!'
        });
    }
    bcryptjs_1.default.compare(req.body.password, user.password, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            res.status(500).send({
                message: error.message
            });
        }
        else if (result) {
            let accessToken, refreshToken;
            (0, signJWT_function_1.default)(user, 'access', (_error, result) => {
                if (_error) {
                    res.status(500).send({
                        message: "unable to sign JWT token"
                    });
                }
                accessToken = result;
                (0, signJWT_function_1.default)(user, 'refresh', (_error, _result) => __awaiter(void 0, void 0, void 0, function* () {
                    if (_error) {
                        res.status(500).send({
                            message: "unable to sign JWT token"
                        });
                    }
                    refreshToken = _result;
                    try {
                        yield repository.update(user.id, {
                            email: req.body.email
                        });
                        const userData = yield repository.findOneBy(user.id);
                        if (!!userData) {
                            const { password } = userData, data = __rest(userData, ["password"]);
                            res.status(200)
                                // .cookie('refreshToken', refreshToken, { httpOnly: true, domain: process.env.NODE_ENV === 'development' ? '.localhost' : '.vercel.app' })
                                // .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                                .cookie('refreshToken', refreshToken, {
                                secure: true,
                                httpOnly: false,
                                sameSite: 'none',
                                // domain:"pakautomotive.com",
                                // domain: process.env.NODE_ENV === 'development' ? '.localhost' : '.vercel.app'
                            })
                                //.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'strict' })
                                //.header('Authorization', accessToken)
                                .send({
                                user: data,
                                refreshToken,
                                accessToken,
                                message: "email updated successfully"
                            });
                        }
                    }
                    catch (e) {
                        res.status(500).send({
                            message: e
                        });
                    }
                }));
            });
        }
        else {
            res.status(401).send({
                message: `Invalid password`
            });
        }
    }));
});
exports.UpdateUserEmail = UpdateUserEmail;
const ValidateRefreshToken = (req, res, next) => {
    return res.status(200).json({
        message: 'Refresh Token Authorized'
    });
};
exports.ValidateRefreshToken = ValidateRefreshToken;
