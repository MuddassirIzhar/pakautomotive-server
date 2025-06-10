import { Router } from "express";
import { CreateReminder, DeleteReminder, GetMyReminders, GetReminder, GetReminders, UpdateReminder } from "../controller/reminder.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
import extractJWT from "../middleware/extractJWT.middleware";
import { CheckPermissions } from "../middleware/permission.middleware";
import { refreshJWT } from "../middleware/refreshJWT.middleware";

const router = Router();



// user administration - get all reminders
router.get('/reminders', CheckAuthState, CheckPermissions('users'), GetReminders)
// user administration - get my reminders
router.get('/reminders/me', CheckAuthState, CheckPermissions('users'), GetMyReminders)
// user administration - get user by ID
router.get('/reminders/:id', CheckAuthState, GetReminder)
// user administration - create new user
router.put('/reminders/:id', CheckAuthState, UpdateReminder)
// user administration - create new user
router.post('/reminders', CheckAuthState, CreateReminder)
// user administration - delete user
router.delete('/reminders/:id', CheckAuthState, DeleteReminder)


export default router;