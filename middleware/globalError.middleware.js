const {handleError }=require("../utils/handlers.utils")

const globalErrorMiddleware=async(error,req,res,next)=>{
    const status=error.status ?? 500
    const message=error.message ?? "Something went wrong"
    handleError(res,status,message,null)
}
module.exports={globalErrorMiddleware}