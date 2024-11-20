
const {body }=require("express-validator")

const SignupValidation=[
    
        body("username")
        .isString().withMessage("username must be a string")
        .notEmpty().withMessage("user name is required")
        .trim(),
    
    
        body("email")
        .isString().withMessage("Email must be  a string")
        .isEmail().withMessage("Please Enter a valid email address")
        .notEmpty().withMessage("Email is required")
        .normalizeEmail(),
    

        body('password')
        .notEmpty().withMessage("password is required")  
        .isLength({min:9}).withMessage("password must be 9 character")
        .isString().trim(),
    
    
        body('confirmPassword')
        .notEmpty().withMessage("confirm password is required")
        .custom((value,{req})=>value===req.body.password).withMessage("do not match Password")
        .isString().trim()
    
]

const ResetPassword=[
        body("newPassword")
        .notEmpty().withMessage("new Password is required")
        .isLength({min:9}).withMessage("new password must be 9 character")
        .isString().trim(),

        body("confirmPassword")
        .notEmpty().withMessage("confirm password is required")
        .custom((value,{req})=>value===req.body.newPassword).withMessage("do not match Password")
        .isString().trim()
]
module.exports={SignupValidation,ResetPassword}