
const User =require("../models/user.model")
const generateAccessAndRefreshToken=async(userId)=>{

    const user=await User.findById(userId)
    const AccessToken=await user.generateAccessToken()
    const RefreshToken=await user.generateRefreshToken()
    user.refreshToken=RefreshToken
    await user.save({validateBeforeSave:false})
    return {AccessToken,RefreshToken}
}

module.exports={
    generateAccessAndRefreshToken
}