import Router from "express";
import * as orderController from "./controller/order.controller.js";
import * as orderValidation from "./order.validation.js";
import orderEndpoint from "./order.endpoints.js";
import auth from "../../middleware/auth.js";
import * as authvalidation from "../auth/auth.validation.js";
import validation from "../../middleware/validation.js";

const router = Router();
//onway and rejected عليا 

router.post(
  "/",
  validation(authvalidation.tokenSchema, true),
  auth(orderEndpoint.createOrder),
  validation(orderValidation.createOrderSchema),
  orderController.createOrder
);

router.put(
  "/:cancelOrder/orderId",
  validation(authvalidation.tokenSchema, true),
  auth(orderEndpoint.cancelOrder),
  validation(orderValidation.cancelOrderSchema),
  orderController.cancelOrder
);

router.put(
  "/deliverOrder/:orderId",
  validation(authvalidation.tokenSchema, true),
  auth(orderEndpoint.deliveredOreder),
  validation(orderValidation.deliveredOrderSchema),
  orderController.deliveredOrder
);

// router.patch(
//   "/",
//   validation(authvalidation.tokenSchema, true),
//   auth(orderEndpoint.deleteFromorder),
//   orderController.removeAllProducts
// );

export default router;
