"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_controller_1 = require("../controller/service.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// service administration - get all services
// router.get('/services', CheckAuthState, CheckPermissions('services'), GetServices)
router.get('/services', auth_middleware_1.CheckAuthState, service_controller_1.GetServices);
// service administration - get service by ID
router.get('/services/:id', auth_middleware_1.CheckAuthState, service_controller_1.GetService);
// service administration - create new service
router.put('/services/:id', auth_middleware_1.CheckAuthState, service_controller_1.UpdateService);
// service administration - create new service
router.post('/services', auth_middleware_1.CheckAuthState, service_controller_1.CreateService);
// service administration - delete service
router.delete('/services/:id', auth_middleware_1.CheckAuthState, service_controller_1.DeleteService);
exports.default = router;
