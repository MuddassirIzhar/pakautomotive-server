import { Router } from "express";
import { CreateBrand, DeleteBrand, GetBrand, GetBrands, UpdateBrand } from "../controller/brand.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
import { CheckPermissions } from "../middleware/permission.middleware";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });


const router = Router();
// brand administration - get all brands
// router.get('/brands', CheckAuthState, CheckPermissions('brands'), GetBrands)
router.get('/brands', CheckAuthState, GetBrands)
// brand administration - get brand by IDENTIFIER
router.get('/brands/:identifier', CheckAuthState, GetBrand)
// brand administration - create new brand
router.put('/brands/:id', upload.array("images[]"), CheckAuthState, UpdateBrand)
// brand administration - create new brand
router.post('/brands', upload.array("images[]"), CheckAuthState, CreateBrand)
// brand administration - delete brand
router.delete('/brands/:id', CheckAuthState, DeleteBrand)

export default router;