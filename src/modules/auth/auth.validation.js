import Joi from "joi"
import { generalfields } from "../../utils/generalfields.js"


export const signupSchema = Joi.object({
userName : Joi.string().min(3).max(20).required(),
email : generalfields.email,
password : generalfields.password,
cpassword : Joi.string().valid(Joi.ref('password')).required(),
role : Joi.string().valid('User','Admin'),
gender:Joi.string().valid('Female','Male'),
status:Joi.string().valid('Offline','Online'),
address : Joi.string(),
image : Joi.string(),
DOB : Joi.string(),
phone : Joi.string().length(11), 
file : generalfields.file
}).required()

export const loginSchema = Joi.object({
    email : generalfields.email,
    password : generalfields.password,
    }).required()

export const tokenSchema = Joi.object({
        auth: Joi.string().required()
    }).required()

export const sendCodeSchema = Joi.object({
    email: generalfields.email
}).required()

export const forgetPasswordSchema = Joi.object({
    email : generalfields.email,
    newPassword : generalfields.password,
    cPassword : Joi.string().valid(Joi.ref('newPassword')).required(),
    code : Joi.string().pattern(new RegExp(/^\d{5}$/)).required()

    }).required()