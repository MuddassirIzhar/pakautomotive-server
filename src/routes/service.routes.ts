import { Router } from "express";
import { CreateService, DeleteService, GetService, GetServices, UpdateService } from "../controller/service.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
import { CheckPermissions } from "../middleware/permission.middleware";


const router = Router();
// service administration - get all services
// router.get('/services', CheckAuthState, CheckPermissions('services'), GetServices)
router.get('/services', CheckAuthState, GetServices)
// service administration - get service by ID
router.get('/services/:id', CheckAuthState, GetService)
// service administration - create new service
router.put('/services/:id', CheckAuthState, UpdateService)
// service administration - create new service
router.post('/services', CheckAuthState, CreateService)
// service administration - delete service
router.delete('/services/:id', CheckAuthState, DeleteService)

export default router;