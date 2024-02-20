import {Router} from "express"
import uploadFilecloud, { fileValidation } from "../../utils/multer.js"
import * as SubCategoryschema from './subCategory.validation.js'
import * as subCategoryControl from './controller/subCategory.controller.js'
import validation from "../../middleware/validation.js"
import * as authvalidation from '../auth/auth.validation.js'
import auth from "../../middleware/auth.js"
import roles from "../../utils/roles.js"

const router = Router({mergeParams : true})

router.post('/',validation(authvalidation.tokenSchema,true),auth(Object.keys(roles)),uploadFilecloud(fileValidation.image).single('file'),validation(SubCategoryschema.addSubCategorySchema),subCategoryControl.addSubCategory)
.get('/',subCategoryControl.allSubCategories)
.get('/:subCategoryId',validation(SubCategoryschema.oneSubCategorySchema),subCategoryControl.oneSubCategory)
.put('/:subCategoryId',validation(authvalidation.tokenSchema,true),auth(Object.keys(roles)),uploadFilecloud(fileValidation.image).single('file'),validation(SubCategoryschema.updateSubCategorySchema),subCategoryControl.updateSubCategory)






export default router