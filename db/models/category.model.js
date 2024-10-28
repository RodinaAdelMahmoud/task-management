import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({

title:{
    type:String,
    required:[true,"title is required"],
  
    trim:true,
    lowercase:true,


},
type:{
    type:String,
    enum: ["work", "personal"],
    default:"personal"
},
tasks:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Task",

}],



createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
isDeleted:{
    type:Boolean,
    default:false       
}


},


{
    timestamps:true})

const categoryModel = mongoose.model("category",categorySchema)
export default categoryModel