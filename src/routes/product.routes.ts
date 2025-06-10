
import { Router } from "express";
import { CreateProduct, DeleteProduct, GetProduct, GetProducts, UpdateProduct } from "../controller/product.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
const router = Router();

// product administration - get all products
router.get('/api/products', CheckAuthState, GetProducts)
// product administration - get product by ID
router.get('/api/products/:id', CheckAuthState, GetProduct)
// product administration - create new product
router.put('/api/products/:id', CheckAuthState, UpdateProduct)
// product administration - create new product
router.post('/api/products', CheckAuthState, CreateProduct)
// product administration - delete product
router.delete('/api/products/:id', CheckAuthState, DeleteProduct)

export default router;