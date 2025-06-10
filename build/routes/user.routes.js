"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const user_controller_1 = require("../controller/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const extractJWT_middleware_1 = __importDefault(require("../middleware/extractJWT.middleware"));
const permission_middleware_1 = require("../middleware/permission.middleware");
const refreshJWT_middleware_1 = require("../middleware/refreshJWT.middleware");
const router = (0, express_1.Router)();
// register new user
router.post('/auth/register', auth_controller_1.Register);
// login known user
router.post('/auth/login', auth_controller_1.Login);
// get authenticated user from jwt
router.get('/user', auth_middleware_1.CheckAuthState, auth_controller_1.AuthenticatedUser);
// force expire jwt to log out
router.post('/auth/logout', auth_middleware_1.CheckAuthState, auth_controller_1.Logout);
// update user info
router.put('/user/info', extractJWT_middleware_1.default, auth_middleware_1.CheckAuthState, auth_controller_1.UpdateUserInfo);
// update user password
router.put('/user/pass', auth_middleware_1.CheckAuthState, auth_controller_1.UpdateUserPass);
// update user password
router.put('/user/email', auth_middleware_1.CheckAuthState, auth_controller_1.UpdateUserEmail);
// validation refresh token from request cookie 
router.post('/validateRefreshToken', refreshJWT_middleware_1.refreshJWT, auth_controller_1.ValidateRefreshToken);
// user administration - get all users
router.get('/users', auth_middleware_1.CheckAuthState, (0, permission_middleware_1.CheckPermissions)('users'), user_controller_1.GetUsers);
// user administration - get user by ID
router.get('/users/:id', auth_middleware_1.CheckAuthState, user_controller_1.GetUser);
// user administration - create new user
router.put('/users/:id', auth_middleware_1.CheckAuthState, user_controller_1.UpdateUser);
// user administration - create new user
router.post('/users', auth_middleware_1.CheckAuthState, user_controller_1.CreateUser);
// user administration - delete user
router.delete('/users/:id', auth_middleware_1.CheckAuthState, user_controller_1.DeleteUser);
exports.default = router;
