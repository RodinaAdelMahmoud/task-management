import express from "express";
import * as CC from './category.controller.js'
import { auth } from './../../middleware/auth.js';
import { categoryValidator } from "../../middleware/validation.js";
const router = express.Router();

router.post('/',auth(['admin', 'user']),categoryValidator, CC.addCategory);
router.get('/', auth(['admin', 'user']), CC.getCategories);
router.patch('/', auth(['admin', 'user']),CC.updateCategory);
router.delete('/', auth(['admin', 'user']),CC.deleteCategory);


export default router;