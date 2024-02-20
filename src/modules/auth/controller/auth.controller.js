import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/asynchandler.js";
import { generateToken, verifyToken } from "../../../utils/generateandverifytoken.js";
import sendEmail from "../../../utils/email.js";
import { compare, hash } from "../../../utils/hashandcompare.js";
import { customAlphabet } from "nanoid";

export const signUp = asyncHandler (
    async(req,res,next)=>{
    const {email}=req.body
const emailExist = await userModel.findOne({email})
if (emailExist){
 return next(new Error('email exist ,please login'),{cause : 409})
}
const token = generateToken({payload:{email},signature: process.env.EMAIL_SEGNATURE,expiresIn: 60*30})
const RefreshToken = generateToken({payload:{email},signature: process.env.EMAIL_SEGNATURE,expiresIn: 60*60*24})
const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
const refreshLink = `${req.protocol}://${req.headers.host}/auth/refreshToken/${RefreshToken}`
const html = `<a href='${link}'>confirm email</a> 
<br>
<br> 
<a href='${refreshLink}'>
refreshToken</a>`
if(! sendEmail({to:email,subject:'confirmemail', html})){
    return next(new Error('failed to send email'),{cause : 400})
}
req.body.password = hash({plaintext:req.body.password})
const user = await userModel.create(req.body)
res.json({message:"done",user})
})

export const confirmEmail = asyncHandler(async(req,res,next)=>{
const {token} = req.params
const {email}= verifyToken({token,signature: process.env.EMAIL_SEGNATURE})
const user = await userModel.findOne({email})
if(! user){
return res.redirect('https://www.facebook.com/')
}
if(user.confirmEmail){
    return res.redirect('https://www.linkedin.com/in/yasmin-yasser-259b521b3/')
}
await userModel.updateOne({email},{confirmEmail : true},{new:true})
return res.redirect('https://www.linkedin.com/in/yasmin-yasser-259b521b3/')
})

export const refreshToken = asyncHandler(async(req,res,next)=>{
    const {token} = req.params
    const {email}= verifyToken({token,signature: process.env.EMAIL_SEGNATURE})
    const user = await userModel.findOne({email})
    if(! user){
    return res.redirect('https://www.facebook.com/')
    }
    if(user.confirmEmail){
        return res.redirect('https://www.linkedin.com/in/yasmin-yasser-259b521b3/')
    }
    const newtoken = generateToken({payload:{email},signature: process.env.EMAIL_SEGNATURE,expiresIn: 60*10})
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newtoken}`
    const html = `<a href='${link}'> confirm email</a> `
if(! sendEmail({to:email,subject:'confirmemail', html})){
    return next(new Error('failed to send email'),{cause : 400})
}
 return res.send('<h1>chech your email</h1>')
    })

export const login = asyncHandler(async(req,res,next)=>{
const {email , password} = req.body 
const user = await userModel.findOne({email})
if(!user){
    return next(new Error(' wrong email or password '),{cause : 400})
}
if (! user.confirmEmail){
    return next(new Error('please confirm email'),{cause : 400})
}
const match = compare({plaintext:password,hashValue:user.password})
if(!match){
    return next(new Error('wrong email or password'),{cause : 400})
}
if(user.isDeleted){
    user.isDeleted = false
}
user.status = 'Online'
await user.save()
const token = generateToken({payload:{email,_id:user._id , role :user.role},expiresIn: 60*30})
const refreshToken = generateToken({payload:{email,_id:user._id , role :user.role},expiresIn: 60*60*24*30})
return res.json({message:"done",token,refreshToken})
}) 
//find email exist or not 
//email confirmed ?
//create code 
//send email 
//store code in DB
export const sendCode = asyncHandler(
    async(req,res,next)=>{
const {email} = req.body 
const userExist = await userModel.findOne({email})
if(!userExist){
    return next(new Error('email not found'),{cause : 400})
}
if(! userExist.confirmEmail){
    return next(new Error('confirm email first'),{cause : 400})
}
const nanoId = customAlphabet('1234567890',5)
const code = nanoId()
if(! sendEmail({to:email,subject:'forget password', html:`<h1>${code}</h1>`})){
    return next(new Error('failed to send email'),{cause : 400})
}
await userModel.updateOne({email},{code})
return res.status(200).json({message:"check email"})
})

export const forgetPassword = asyncHandler(
    async(req,res,next)=>{
const {email,code,newPassword} = req.body 
const userExist = await userModel.findOne({email})
if(!userExist){
    return next(new Error('email not found'),{cause : 400})
}
if(code !== userExist.code || code == null){
    return next(new Error('wrong code'),{cause : 400})
}
let password = hash({plaintext:newPassword})
const updateUser = await userModel.findOneAndUpdate({email},{password,code:null,status:'Offline '},{new:true})
return res.status(200).json({message:"done",updateUser})
})
