import express from "express";
import * as TC from './task.controller.js'
import { auth } from '../../middleware/auth.js';
import { systemRoles } from "../../../utils/systemRoles.js";
import { taskValidator } from "../../middleware/validation.js";
const router = express.Router();

router.post('/',auth(systemRoles.admin),taskValidator,TC.addTask);
router.get('/',auth(systemRoles.admin),TC.getTasks);
router.patch('/',auth(systemRoles.admin),TC.updateTask);
router.delete('/',auth(systemRoles.admin),TC.deleteTask);



export default router;
