import mongoose  from "mongoose";

const connectionDb = async()  => {
    return await  mongoose.connect("mongodb+srv://rodinayassine21:mLGDaeo07TsXRttF@cluster0.ohwk0.mongodb.net/")
    .then(() => console.log("DB connected")).catch((err)=>{
        console.log("DB connection error",err)
    })
}
export default connectionDb