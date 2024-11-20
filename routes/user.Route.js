const {Router}=require("express")
const { regiterUser, verifiedUser, loginUser } = require("../controllers/user.controller")
const SignupValidation = require("../validations/signup.validation")
const { ErrorResult } = require("../validations/result.validation")


const userRoute=Router()

userRoute.post("/register",SignupValidation,ErrorResult,regiterUser)
userRoute.get("/verify/:verificationToken",verifiedUser)
userRoute.post("/login",loginUser)
module.exports=userRoute