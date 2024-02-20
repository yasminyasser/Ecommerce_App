import Router from "express"
import uploadFilecloud, { fileValidation } from "../../utils/multer.js"
import * as couponControl from "./controller/coupon.controller.js"
import validation from "../../middleware/validation.js"
import * as couponvalidationSchema from './coupon.validation.js'
import * as authvalidation from '../auth/auth.validation.js'
import auth from "../../middleware/auth.js"
import roles from "../../utils/roles.js"

const router = Router()

router.post('/',validation(authvalidation.tokenSchema,true),auth(Object.keys(roles)),uploadFilecloud(fileValidation.image).single('file'),validation(couponvalidationSchema.addCouponSchema),couponControl.createCoupon)
.get('/',couponControl.allCoupons)
.get('/:couponId',validation(couponvalidationSchema.oneCouponSchema),couponControl.oneCoupon)
.put('/:couponId',validation(authvalidation.tokenSchema,true),auth(Object.keys(roles)),uploadFilecloud(fileValidation.image).single('file'),validation(couponvalidationSchema.updateCouponSchema),couponControl.updateCoupon)




export default router