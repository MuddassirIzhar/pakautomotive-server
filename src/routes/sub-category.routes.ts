import { Router } from "express";
import { CreateSubCategory, DeleteSubCategory, GetSubCategory, GetSubCategories, UpdateSubCategory } from "../controller/sub-category.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
import { CheckPermissions } from "../middleware/permission.middleware";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });


const router = Router();
router.get('/sub-categories', CheckAuthState, GetSubCategories)
// categorie - get categorie by ID
router.get('/sub-categories/:id', CheckAuthState, GetSubCategory)
// categorie - create new categorie
router.put('/sub-categories/:id', upload.array("images[]"), CheckAuthState, UpdateSubCategory)
// categorie - create new categorie
router.post('/sub-categories', upload.array("images[]"), CheckAuthState, CreateSubCategory)
// categorie - delete categorie
router.delete('/sub-categories/:id', CheckAuthState, DeleteSubCategory)

export default router;