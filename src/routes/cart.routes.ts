import { Router } from "express";
import { CartController } from "../controllers/cart.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

const cartController = new CartController();

router.get(
  "/",
  requireAuth,
  cartController.getCart.bind(cartController)
);

router.post(
  "/items",
  requireAuth,
  cartController.addProductToCart.bind(cartController)
);

router.patch(
  "/items/:productId",
  requireAuth,
  cartController.updateCartItem.bind(cartController)
);

router.delete(
  "/items/:productId",
  requireAuth,
  cartController.removeProductFromCart.bind(cartController)
);

router.delete(
  "/",
  requireAuth,
  cartController.clearCart.bind(cartController)
);

export default router;