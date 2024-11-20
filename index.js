
const { connectDatabase}=require("./db/index")
const app=require("./app")
const { PORT } = require("./config/config")
const rootRouter =require("./routes/root.Route")

connectDatabase()
.then(()=>{
    app.use("/api/v1",rootRouter)
    app.listen(PORT,()=>console.log(`Server is running on port : ${PORT}`))
})
.catch((error)=>{
    console.log("ERROR OCCURED IN CONNECTION",error)
})