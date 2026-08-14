import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

const router = Router();

const productController =
  new ProductController();

router.post(
  "/",
  productController.createProduct
);

router.get(
  "/",
  productController.getProducts
);

router.get(
  "/:id",
  productController.getProductById
);

router.patch(
  "/:id",
  productController.updateProduct
);

router.patch(
  "/:id/stock",
  productController.updateStock
);

router.patch(
  "/:id/deactivate",
  productController.deactivateProduct
);

export default router;