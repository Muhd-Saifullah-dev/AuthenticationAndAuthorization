const mongoose=require("mongoose")
const {MONGO_URI}=require("../config/config")
const {DB_NAME }=require("../constant")
const connectDatabase=async()=>{

    try {
        const connectionInstance=await mongoose.connect(`${MONGO_URI}/${DB_NAME}`) 
        console.log(`MONGO DB connected || DB Host : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("ERROR MONGODB CONNECTION FAILED !!! : ",error)
        process.exit(1)
    }
}


module.exports={
    connectDatabase
}