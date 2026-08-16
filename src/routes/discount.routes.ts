import { Router } from "express";
import { DiscountController } from "../controllers/discount.controller.js";
import {
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware.js";

const router = Router();

const discountController =
  new DiscountController();

// Public
router.get(
  "/",
  discountController.getDiscounts
);

router.get(
  "/:id",
  discountController.getDiscountById
);

// Admin
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  discountController.createDiscount
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  discountController.updateDiscount
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  discountController.deleteDiscount
);

export default router;