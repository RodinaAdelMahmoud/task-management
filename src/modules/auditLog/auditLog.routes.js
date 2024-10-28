import express from "express";
import * as auditController from './auditLog.controller.js'
import { auth } from '../../middleware/auth.js';
import { systemRoles } from "../../../utils/systemRoles.js";
const auditLogRouter = express.Router();

auditLogRouter.get('/',auth(systemRoles.admin),auditController.taskHistory);



export default auditLogRouter;
