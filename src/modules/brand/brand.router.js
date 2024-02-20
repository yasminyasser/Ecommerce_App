import Router from "express"
import uploadFilecloud, { fileValidation } from "../../utils/multer.js"
import * as brandControl from "./controller/brand.controller.js"
import validation from "../../middleware/validation.js"
import * as brandValidation from './brand.validation.js'
import * as authvalidation from '../auth/auth.validation.js'
import auth from "../../middleware/auth.js"
import roles from "../../utils/roles.js"

const router = Router()

router.post('/',validation(authvalidation.tokenSchema,true),auth(Object.keys(roles)),uploadFilecloud(fileValidation.image).single('image'),validation(brandValidation.addBrandSchema),brandControl.addBrand)
.get('/',brandControl.allBrands)
.get('/:brandId',validation(brandValidation.oneBrandSchema),brandControl.oneBrand)
.put('/:brandId',validation(authvalidation.tokenSchema,true),auth(Object.keys(roles)),uploadFilecloud(fileValidation.image).single('image'),validation(brandValidation.updateBrandSchema),brandControl.updateBrands)






export default router