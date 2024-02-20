export const asyncHandler = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch((error)=>{

return next(new Error (error,{cause:500}))
        })
    }
    }

// 500 --> internal server error 
// next ? 


export const globalError = (error,req,res,next)=>{
if (req.validationresult){
    return res.status(error.cause || 400).json({message: error.message , details : req.validationresult.details })
}
    if(process.env.MOOD == 'DEV'){ // لسة بكتب الكود فهظهر ال stack ليا 
        return res.status(error.cause || 400).json({message: error.message , stack : error.stack })
    }
    return res.status(error.cause || 400).json({message: error.message})
    }

//400 --> bad request


