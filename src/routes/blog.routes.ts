import { Router } from "express";
import { CreateBlog, DeleteBlog, GetBlog, GetBlogs, UpdateBlog } from "../controller/blog.controller";
import { CheckAuthState } from "../middleware/auth.middleware";
import { CheckPermissions } from "../middleware/permission.middleware";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });


const router = Router();
// blog administration - get all blogs
// router.get('/blogs', CheckAuthState, CheckPermissions('blogs'), GetBlogs)
router.get('/blogs', CheckAuthState, GetBlogs)
// blog administration - get blog by IDENTIFIER
router.get('/blogs/:identifier', CheckAuthState, GetBlog)
// // blog administration - get blog by SLUG
// router.get('/blogs/:slug', CheckAuthState, GetBlog)
// blog administration - create new blog
router.put('/blogs/:id', upload.array("images[]"), CheckAuthState, UpdateBlog)
// blog administration - create new blog
router.post('/blogs', upload.array("images[]"), CheckAuthState, CreateBlog)
// blog administration - delete blog
router.delete('/blogs/:id', CheckAuthState, DeleteBlog)

export default router;