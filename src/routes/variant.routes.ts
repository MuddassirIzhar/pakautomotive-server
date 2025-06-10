import { Router } from "express";
import { CreateVariant, DeleteVariant, GetVariant, GetVariants, UpdateVariant } from "../controller/variant.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
import { CheckPermissions } from "../middleware/permission.middleware";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });


const router = Router();
// variant administration - get all variants
// router.get('/variants', CheckAuthState, CheckPermissions('variants'), GetVariants)
router.get('/variants', CheckAuthState, GetVariants)
// model administration - get brand by IDENTIFIER
router.get('/variants/:identifier', CheckAuthState, GetVariant)
// variant administration - create new variant
router.put('/variants/:id', upload.array("images[]"), CheckAuthState, UpdateVariant)
// variant administration - create new variant
router.post('/variants', upload.array("images[]"), CheckAuthState, CreateVariant)
// variant administration - delete variant
router.delete('/variants/:id', CheckAuthState, DeleteVariant)

export default router;