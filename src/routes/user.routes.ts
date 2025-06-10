import { Router } from "express";
import { AuthenticatedUser, Login, Logout, Register, UpdateUserEmail, UpdateUserInfo, UpdateUserPass, ValidateRefreshToken } from "../controller/auth.controller";
import { CreateUser, DeleteUser, GetUser, GetUsers, UpdateUser } from "../controller/user.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
import extractJWT from "../middleware/extractJWT.middleware";
import { CheckPermissions } from "../middleware/permission.middleware";
import { refreshJWT } from "../middleware/refreshJWT.middleware";
const router = Router();
// register new user
router.post('/auth/register', Register)
// login known user
router.post('/auth/login', Login)
// get authenticated user from jwt
router.get('/user', CheckAuthState, AuthenticatedUser)
// force expire jwt to log out
router.post('/auth/logout', CheckAuthState, Logout)
// update user info
router.put('/user/info', extractJWT, CheckAuthState, UpdateUserInfo)
// update user password
router.put('/user/pass', CheckAuthState, UpdateUserPass)
// update user password
router.put('/user/email', CheckAuthState, UpdateUserEmail)

// validation refresh token from request cookie 
router.post('/validateRefreshToken',refreshJWT,ValidateRefreshToken);



// user administration - get all users
router.get('/users', CheckAuthState, CheckPermissions('users'), GetUsers)
// user administration - get user by ID
router.get('/users/:id', CheckAuthState, GetUser)
// user administration - create new user
router.put('/users/:id', CheckAuthState, UpdateUser)
// user administration - create new user
router.post('/users', CheckAuthState, CreateUser)
// user administration - delete user
router.delete('/users/:id', CheckAuthState, DeleteUser)


export default router;