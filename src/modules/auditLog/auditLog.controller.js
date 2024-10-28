import jwt from "jsonwebtoken";
import { AppError } from "../../../utils/AppError.js";
import { handleError } from "../../../utils/globalErrorHandler.js";
import AuditLogModel from './../../../db/models/auditLog.model.js';

// =========== TASK HISTORY ===========
export const taskHistory = handleError(async (req, res, next) => {
    try {
        const { taskId } = req.query;

        if (!taskId) {
            return next(new AppError("Task ID is required", 400));
        }

        const logs = await AuditLogModel.find({ taskId })
            .sort({ timestamp: -1 })
            .populate("modifiedBy", "name");

        if (!logs) {
            return next(new AppError("No history found for this task", 404));
        }

        res.status(200).json({ taskHistory: logs });
    } catch (error) {
        return next(new AppError("Error retrieving task history", 500));
    }
});
