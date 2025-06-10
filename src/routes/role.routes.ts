import express, {Router} from 'express';
import { CreateRole, DeleteRole, FileUpload, GetRole, Roles, UpdateRole } from "../controller/roles.controller";
import { CheckAuthState } from "../middleware/auth.middleware";

const router = Router();

router.get('/roles', CheckAuthState, Roles)
router.post('/roles', CheckAuthState, CreateRole)
router.get('/roles/:id', CheckAuthState, GetRole)
router.put('/roles/:id', CheckAuthState, UpdateRole)
router.delete('/roles/:id', CheckAuthState, DeleteRole)

export default router;