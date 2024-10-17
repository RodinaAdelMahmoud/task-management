import mongoose  from "mongoose";
import { systemRoles } from "../../utils/systemRoles.js";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        minLength:3,
        maxLength:15,

    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
        trim:true
    },
   
    code:{type:String},
    role:{
        type:String,
        enum:Object.values(systemRoles),
        default:"user"
    },
   
 
})

const userModel = mongoose.model("User",userSchema)
export default userModel