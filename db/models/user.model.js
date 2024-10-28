import mongoose  from "mongoose";
import { systemRoles } from "../../utils/systemRoles.js";
import { hash } from "bcrypt";

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
        trim:true,
        
    },

   
    code:{type:String},
    role:{
        type:String,
        enum:Object.values(systemRoles),
        default:"user"
    },
   
 
})

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        try {
           
            this.password = await hash(this.password, process.env.saltRounds);
        } catch (error) {
            return next(error);
        }
    }
    next(); 
})

const userModel = mongoose.model("User",userSchema)
export default userModel