import AuditLogModel from "../../db/models/auditLog.model.js";

export const logTaskChange = async ({ taskId, modifiedBy, changeType, oldValue, newValue }) => {
    try {
        const logEntry =  new AuditLogModel({
            taskId,
            modifiedBy,
            changeType,
            oldValue,
            newValue,
            timestamp: new Date(), 
        });

        await logEntry.save();
    } catch (error) {
        console.error("Error logging task change:", error); 
        throw new Error("Could not log task change"); 
    }
};