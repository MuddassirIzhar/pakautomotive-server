"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reminder_controller_1 = require("../controller/reminder.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const permission_middleware_1 = require("../middleware/permission.middleware");
const router = (0, express_1.Router)();
// user administration - get all reminders
router.get('/reminders', auth_middleware_1.CheckAuthState, (0, permission_middleware_1.CheckPermissions)('users'), reminder_controller_1.GetReminders);
// user administration - get my reminders
router.get('/reminders/me', auth_middleware_1.CheckAuthState, (0, permission_middleware_1.CheckPermissions)('users'), reminder_controller_1.GetMyReminders);
// user administration - get user by ID
router.get('/reminders/:id', auth_middleware_1.CheckAuthState, reminder_controller_1.GetReminder);
// user administration - create new user
router.put('/reminders/:id', auth_middleware_1.CheckAuthState, reminder_controller_1.UpdateReminder);
// user administration - create new user
router.post('/reminders', auth_middleware_1.CheckAuthState, reminder_controller_1.CreateReminder);
// user administration - delete user
router.delete('/reminders/:id', auth_middleware_1.CheckAuthState, reminder_controller_1.DeleteReminder);
exports.default = router;
