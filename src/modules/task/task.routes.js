import express from "express";
import * as taskController from './task.controller.js'
import { auth } from '../../middleware/auth.js';
import { systemRoles } from "../../../utils/systemRoles.js";
import { taskValidator } from "../../middleware/validation.js";
const router = express.Router();

router.post('/',auth(systemRoles.admin),taskValidator,taskController.addTask);
router.patch('/',auth(systemRoles.admin),taskController.updateTask);
router.get('/',auth(systemRoles.admin),taskController.getTasks);
router.delete('/',auth(systemRoles.admin),taskController.deleteTask);
router.patch('/archive',auth(systemRoles.admin),taskController.archiveTask);
router.get('/retrieve',auth(systemRoles.admin),taskController.retrieveTasks);
router.patch('/restore',auth(systemRoles.admin),taskController.restoreTask);



export default router;
