import {Router} from 'express';

import { AllBrandModelAndVariants, AllModelsBySubCategory } from '../controller/global.controller';

const router = Router();

router.get('/all-brand-model-and-variants', AllBrandModelAndVariants)
router.get('/all-models-by-category/:identifier', AllModelsBySubCategory)

export default router;