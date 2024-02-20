import { Router } from "express"
import * as authController from './controller/auth.controller.js'
import validation from "../../middleware/validation.js"
import * as authValidation from './auth.validation.js'
const router = Router()

router.post('/signUp',validation(authValidation.signupSchema),authController.signUp)
.get('/confirmEmail/:token',validation(authValidation.tokenSchema),authController.confirmEmail)
.get('/refreshToken/:token',validation(authValidation.tokenSchema),authController.refreshToken)
.post('/login',validation(authValidation.loginSchema),authController.login)
.patch('/',validation(authValidation.sendCodeSchema),authController.sendCode)
.put('/',validation(authValidation.forgetPasswordSchema),authController.forgetPassword)

export default router