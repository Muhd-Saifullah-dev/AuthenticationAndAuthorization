const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const JWT=require("jsonwebtoken")
const token=require("../config/config")

const userSchema= mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowerCase:true
    },
    password:{
        type:String,
        required:true,
        },
        otp:{
            type:Number,
            default:0
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        verificationToken: {
            type: String,
            required: false,
          },
          refreshToken:{
            type:String,
            default:""
          }
},{timestamps:true})


userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next()

        this.password=await bcrypt.hash(this.password,10)
        next()
})

userSchema.methods.isPasswordCorrect =async function(password) {
return await bcrypt.compare(password,this.password)

}

userSchema.methods.generateAccessToken= function(){
    return JWT.sign(
        {
            id:this._id,
            email:this.email,
            username:this.username
        },
        token.ACCESS_SECRET,{
            expiresIn:token.ACCESS_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    return JWT.sign(
        {
            id:this._id
        },
        token.REFRESH_SECRET,
        {
            expiresIn:token.REFRESH_EXPIRY
        }
    )
}

module.exports=new mongoose.model("User",userSchema)
