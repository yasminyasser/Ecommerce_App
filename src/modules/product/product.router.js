import Router from 'express'
import * as productController from './controller/product.controller.js'
import uploadFilecloud, { fileValidation } from '../../utils/multer.js'
import auth from '../../middleware/auth.js'
import productEndpoint from './product.endpoint.js'
import * as authValidation from '../auth/auth.validation.js'
import validation from '../../middleware/validation.js'
import * as productValidation from './product.validation.js'



const router = Router()

router.post('/',validation(authValidation.tokenSchema,true),auth(productEndpoint.create),uploadFilecloud(fileValidation.image).fields([{
    name:'mainImage',
    maxCount:1
},{
name:'subImage',
maxCount:5
}]),validation(productValidation.addProductSchema),productController.addProduct)
.get('/',productController.allProducts)
.get('/:productId',validation(productValidation.oneProductSchema),productController.oneProduct)


export default router 