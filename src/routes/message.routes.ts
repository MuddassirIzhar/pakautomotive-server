import express, {Router} from 'express';
import { Messages, CreateMessage, readMessage } from "../controller/message.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
const router = Router();

router.get('/messages/:id', CheckAuthState, Messages)
router.post('/messages', CheckAuthState, CreateMessage)
router.put('/messages/:id', CheckAuthState, readMessage)


export default router;