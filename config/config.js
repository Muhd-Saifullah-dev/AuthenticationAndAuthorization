const path=require("path")

require("dotenv").config({path:path.resolve(__dirname,"../.env")})


module.exports={
    MONGO_URI:process.env.MONGO_URI,
    PORT:process.env.PORT,
    EMAIL_PASSWORD:process.env.EMAIL_PASSWORD,
    ACCESS_SECRET:process.env.ACCESS_TOKEN_SECRET_KEY,
    REFRESH_SECRET:process.env.REFRESH_TOKEN_SECRET_KEY,
    ACCESS_EXPIRY:process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_EXPIRY:process.env.REFRESH_TOKEN_EXPIRY
}

