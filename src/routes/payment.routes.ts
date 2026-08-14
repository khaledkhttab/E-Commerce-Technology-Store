import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";

const router = Router();

const paymentController =
  new PaymentController();

router.post(
  "/",
  paymentController.createPayment
);

router.get(
  "/",
  paymentController.getPayments
);

router.get(
  "/:id",
  paymentController.getPaymentById
);

router.patch(
  "/:id/status",
  paymentController.updatePaymentStatus
);

export default router;
