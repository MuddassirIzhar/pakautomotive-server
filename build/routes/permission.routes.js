"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permission_controller_1 = require("../controller/permission.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/permissions', auth_middleware_1.CheckAuthState, permission_controller_1.Permissions);
exports.default = router;
