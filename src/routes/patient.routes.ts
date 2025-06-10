import express, {Router} from 'express';
import { CreatePatient, DeletePatient, GetPatient, GetMyPatients, GetPatients, UpdatePatient } from "../controller/patient.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
const router = Router();

router.get('/patients', CheckAuthState, GetPatients)
router.get('/patients/me', CheckAuthState, GetMyPatients)
router.post('/patients', CheckAuthState, CreatePatient)
router.get('/patients/:id', CheckAuthState, GetPatient)
router.patch('/patients/:id', CheckAuthState, UpdatePatient)
router.delete('/patients/:id', CheckAuthState, DeletePatient)


export default router;