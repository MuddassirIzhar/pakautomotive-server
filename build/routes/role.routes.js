"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const roles_controller_1 = require("../controller/roles.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const permission_preseed_1 = require("../seeds/permission.preseed");
const role_preseed_1 = require("../seeds/role.preseed");
const userAdmin_preseed_1 = require("../seeds/userAdmin.preseed");
const router = (0, express_1.Router)();
router.get('/roles', auth_middleware_1.CheckAuthState, roles_controller_1.Roles);
router.post('/roles', auth_middleware_1.CheckAuthState, roles_controller_1.CreateRole);
router.get('/roles/:id', auth_middleware_1.CheckAuthState, roles_controller_1.GetRole);
router.put('/roles/:id', auth_middleware_1.CheckAuthState, roles_controller_1.UpdateRole);
router.delete('/roles/:id', auth_middleware_1.CheckAuthState, roles_controller_1.DeleteRole);
// pre-seed permissions
router.get('/preseed/permissions', permission_preseed_1.permissionSeed);
// pre-seed roles
router.get('/preseed/roles', role_preseed_1.roleSeed);
// pre-seed user
router.get('/preseed/users', userAdmin_preseed_1.userAdminSeed);
// image upload
router.post('/upload', auth_middleware_1.CheckAuthState, roles_controller_1.FileUpload);
// make upload route public
router.use('/uploads', express_1.default.static('./uploads'));
exports.default = router;
