
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({

    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
        modifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        changeType: {
            type: String,
            required: true,
        },
       oldValue: {
            type: String,
        },
        newValue: {
            type: String,
        },
    });
    
    const AuditLogModel = mongoose.model("AuditLog", auditLogSchema);
    
    export default AuditLogModel;