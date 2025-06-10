"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controller/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// product administration - get all products
router.get('/api/products', auth_middleware_1.CheckAuthState, product_controller_1.GetProducts);
// product administration - get product by ID
router.get('/api/products/:id', auth_middleware_1.CheckAuthState, product_controller_1.GetProduct);
// product administration - create new product
router.put('/api/products/:id', auth_middleware_1.CheckAuthState, product_controller_1.UpdateProduct);
// product administration - create new product
router.post('/api/products', auth_middleware_1.CheckAuthState, product_controller_1.CreateProduct);
// product administration - delete product
router.delete('/api/products/:id', auth_middleware_1.CheckAuthState, product_controller_1.DeleteProduct);
exports.default = router;
