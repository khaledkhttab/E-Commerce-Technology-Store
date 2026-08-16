import { Router } from "express";
import { BrandController } from "../controllers/brand.controller.js";

import {
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware.js";

const router = Router();

const brandController =
  new BrandController();

// Public
router.get(
  "/",
  brandController.getBrands.bind(brandController)
);

router.get(
  "/:id",
  brandController.getBrandById.bind(brandController)
);

// Admin
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  brandController.createBrand.bind(brandController)
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  brandController.updateBrand.bind(brandController)
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  brandController.deleteBrand.bind(brandController)
);

export default router;