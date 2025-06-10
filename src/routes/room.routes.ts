import express, {Router} from 'express';
import { CreateRoom, DeleteRoom, GetRoom, MyRooms, Rooms } from "../controller/room.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
const router = Router();

router.get('/rooms', CheckAuthState, Rooms)
router.get('/rooms/me', CheckAuthState, MyRooms)
router.post('/rooms', CheckAuthState, CreateRoom)
router.get('/rooms/:id', CheckAuthState, GetRoom)
router.delete('/rooms/:id', CheckAuthState, DeleteRoom)


export default router;