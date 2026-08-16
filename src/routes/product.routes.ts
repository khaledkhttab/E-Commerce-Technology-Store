import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import {
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware.js";

const router = Router();

const productController =
  new ProductController();

// Public
router.get(
  "/",
  productController.getProducts
);

router.get(
  "/:id",
  productController.getProductById
);

// Admin
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  productController.createProduct
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  productController.updateProduct
);

router.patch(
  "/:id/stock",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  productController.updateStock
);

router.patch(
  "/:id/deactivate",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  productController.deactivateProduct
);

export default router;