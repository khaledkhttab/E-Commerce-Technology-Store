import { Router } from "express";
import { DiscountController } from "../controllers/discount.controller.js";

const router = Router();

const discountController =
  new DiscountController();

router.post(
  "/",
  discountController.createDiscount
);

router.get(
  "/",
  discountController.getDiscounts
);

router.get(
  "/:id",
  discountController.getDiscountById
);

router.patch(
  "/:id",
  discountController.updateDiscount
);

router.delete(
  "/:id",
  discountController.deleteDiscount
);

export default router;