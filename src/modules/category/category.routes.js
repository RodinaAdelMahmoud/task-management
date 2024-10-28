import express from "express";
import * as categoryController from './category.controller.js'
import { auth } from './../../middleware/auth.js';
import { categoryValidator } from "../../middleware/validation.js";
const router = express.Router();

router.post('/',auth(['admin', 'user']),categoryValidator, categoryController.addCategory);
router.get('/', auth(['admin', 'user']), categoryController.getCategories);
router.patch('/', auth(['admin', 'user']),categoryController.updateCategory);
router.delete('/', auth(['admin', 'user']),categoryController.deleteCategory);


export default router;