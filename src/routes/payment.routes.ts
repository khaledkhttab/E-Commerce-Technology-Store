import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";
import {
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware.js";

const router = Router();

const paymentController =
  new PaymentController();

// Customer creates payment for his order
router.post(
  "/",
  requireAuth,
  paymentController.createPayment
);

// Admins can see all payments
router.get(
  "/",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  paymentController.getPayments
);

// Authenticated users can access payment
router.get(
  "/:id",
  requireAuth,
  paymentController.getPaymentById
);

// Only admins can verify/reject payments
router.patch(
  "/:id/status",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  paymentController.updatePaymentStatus
);

export default router;