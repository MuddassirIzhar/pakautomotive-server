import express, {Router} from 'express';
import { FileUpload } from "../controller/roles.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
import { permissionSeed } from '../seeds/permission.preseed';
import { roleSeed } from "../seeds/role.preseed";
import { userAdminSeed } from '../seeds/userAdmin.preseed';
import { featureAndSpecificationSeed } from '../seeds/featureAndSpecification.preseed';
const router = Router();



// pre-seed permissions
router.get('/preseed/permissions', permissionSeed)
// pre-seed roles
router.get('/preseed/roles', roleSeed)
// pre-seed user
router.get('/preseed/users',userAdminSeed)
// pre-seed features and specification
router.get('/preseed/feature-and-specifications',featureAndSpecificationSeed)
// image upload
router.post('/upload', CheckAuthState, FileUpload)
// make upload route public
router.use('/uploads', express.static('./uploads'))

export default router;