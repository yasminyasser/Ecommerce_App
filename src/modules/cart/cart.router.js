import Router from "express";
import * as cartController from './controller/cart.controller.js'
import * as cartValidation from './cart.validation.js'
import  cartEndpoint from './cart.endpoint.js'
import auth from "../../middleware/auth.js";
import * as authvalidation from '../auth/auth.validation.js'
import validation from "../../middleware/validation.js"


const router = Router();

router.post('/',
    validation(authvalidation.tokenSchema, true)
    , auth(cartEndpoint.addTocart),
    validation(cartValidation.addTocartSchema),
    cartController.addCart)

router.patch(
  "/:productId",
  validation(authvalidation.tokenSchema, true),
  auth(cartEndpoint.deleteFromCart),
  validation(cartValidation.deleteFromCartSchema),
  cartController.deleteFromCart
);

router.patch(
  "/",
  validation(authvalidation.tokenSchema, true),
  auth(cartEndpoint.deleteFromCart),
  cartController.removeAllProducts
);


export default router;
