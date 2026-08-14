import { Router } from "express";
import { CartController } from "../controllers/cart.controller.js";
import { testAuth } from "../middlewares/test-auth.middleware.js";

const router = Router();

const cartController = new CartController();

router.get(
  "/",
  testAuth,
  cartController.getCart.bind(cartController)
);

router.post(
  "/items",
  testAuth,
  cartController.addProductToCart.bind(cartController)
);

router.patch(
  "/items/:productId",
  testAuth,
  cartController.updateCartItem.bind(cartController)
);

router.delete(
  "/items/:productId",
  testAuth,
  cartController.removeProductFromCart.bind(cartController)
);

router.delete(
  "/",
  testAuth,
  cartController.clearCart.bind(cartController)
);

export default router;