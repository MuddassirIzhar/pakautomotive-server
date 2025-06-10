import express, {Router} from 'express';
import { FeatureAndSpecifications } from "../controller/feature-and-specification.controller";
import { CheckAuthState } from "../middleware/auth.middleware";

const router = Router();

router.get('/feature-and-specifications', CheckAuthState, FeatureAndSpecifications)

export default router;