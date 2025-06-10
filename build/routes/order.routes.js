"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controller/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// get all orders
router.get('/orders', auth_middleware_1.CheckAuthState, order_controller_1.GetOrders);
// export orders
router.post('/api/orders/export/csv', auth_middleware_1.CheckAuthState, order_controller_1.ExportCsv);
// order chart data
router.get('/api/orders/chart', auth_middleware_1.CheckAuthState, order_controller_1.ChartData);
exports.default = router;
