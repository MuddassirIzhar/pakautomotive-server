
import { Router } from "express";
import { ChartData, ExportCsv, GetOrders } from "../controller/order.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
const router = Router();

// get all orders
router.get('/orders', CheckAuthState, GetOrders)
// export orders
router.post('/api/orders/export/csv', CheckAuthState, ExportCsv)
// order chart data
router.get('/api/orders/chart', CheckAuthState, ChartData)

export default router;