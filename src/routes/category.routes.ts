import { Router } from "express";
import { CreateCategory, DeleteCategory, GetCategory, GetCategories, UpdateCategory } from "../controller/category.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
import { CheckPermissions } from "../middleware/permission.middleware";


const router = Router();
router.get('/categories', CheckAuthState, GetCategories)
// categorie - get categorie by ID
router.get('/categories/:id', CheckAuthState, GetCategory)
// categorie - create new categorie
router.put('/categories/:id', CheckAuthState, UpdateCategory)
// categorie - create new categorie
router.post('/categories', CheckAuthState, CreateCategory)
// categorie - delete categorie
router.delete('/categories/:id', CheckAuthState, DeleteCategory)

export default router;