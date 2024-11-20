const { Router}=require("express")
const userRoute = require("./user.Route")

const rootRouter=Router()


rootRouter.use("/user",userRoute)

module.exports=rootRouter