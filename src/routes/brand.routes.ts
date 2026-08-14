import { Router } from "express";
import { BrandController } from "../controllers/brand.controller.js";

const router = Router();

const brandController = new BrandController();

router.get(
  "/",
  brandController.getBrands.bind(brandController)
);

router.get(
  "/:id",
  brandController.getBrandById.bind(brandController)
);

router.post(
  "/",
  brandController.createBrand.bind(brandController)
);

router.patch(
  "/:id",
  brandController.updateBrand.bind(brandController)
);

router.delete(
  "/:id",
  brandController.deleteBrand.bind(brandController)
);

export default router;