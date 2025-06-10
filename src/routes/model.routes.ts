import { Router } from "express";
import { CreateModel, DeleteModel, GetModel, GetModels, UpdateModel } from "../controller/model.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
import { CheckPermissions } from "../middleware/permission.middleware";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });


const router = Router();
// model administration - get all models
// router.get('/models', CheckAuthState, CheckPermissions('models'), GetModels)
router.get('/models', CheckAuthState, GetModels)
// model administration - get brand by IDENTIFIER
router.get('/models/:identifier', CheckAuthState, GetModel)
// model administration - create new model
router.put('/models/:id', upload.array("images[]"), CheckAuthState, UpdateModel)
// model administration - create new model
router.post('/models', upload.array("images[]"), CheckAuthState, CreateModel)
// model administration - delete model
router.delete('/models/:id', CheckAuthState, DeleteModel)

export default router;