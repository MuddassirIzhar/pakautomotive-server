import { Router } from "express";
import { Permissions } from "../controller/permission.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
const router = Router();

router.get('/permissions', CheckAuthState, Permissions)

export default router;