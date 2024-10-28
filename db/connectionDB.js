import mongoose  from "mongoose";

const connectionDb = async()  => {
    return await  mongoose.connect(process.env.Db_URL)
    .then(() => console.log("DB connected")).catch((err)=>{
        console.log("DB connection error",err)
    })
}
export default connectionDb