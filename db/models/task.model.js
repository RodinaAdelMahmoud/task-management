import mongoose  from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"title is required"],
        minLength:3,
        maxLength:15,

    },
    description:{
        type:String,
        required:[true,"description is required"],
        unique:true,
        trim:true,
        lowercase:true
    },
    status:{
        type:String,
        required:[true,"status is required"],
        trim:true,
        enum:["Pending","in-progress","Done"],
        default:"Pending"
    },
   
    priority:{
        type:String,
        enum:["High","Medium","Low"],
        default:"Medium"
    },
   category:{
       type:mongoose.Schema.Types.ObjectId,
       required:[true,"category is required"],
       ref:"Category"
   },

   dueDate:{
type:Date,
default:Date.now
   },

   createdAt:{
       type:Date,
       default:Date.now
   },
   updatedAt:{
       type:Date,
       default:Date.now
   },
   isDeleted:{
       type:Boolean,
       default:false
   },
   archived:{
       type:Boolean,
       default:false
   }
 
})

const taskModel = mongoose.model("Task",taskSchema)
export default taskModel