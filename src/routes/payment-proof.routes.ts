import { Router } from "express";
import { PaymentProofController } from "../controllers/payment-proof.controller.js";
import {
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware.js";

const router = Router();

const controller =
  new PaymentProofController();

// Customer uploads proof
router.post(
  "/",
  requireAuth,
  controller.create
);

// Admins can view all proofs
router.get(
  "/",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  controller.getAll
);

// Customer can access his proof
router.get(
  "/payment/:paymentId",
  requireAuth,
  controller.getByPaymentId
);

// Admins can inspect a specific proof
router.get(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  controller.getById
);

// Customer can update his proof
router.patch(
  "/:id",
  requireAuth,
  controller.update
);

// Customer can delete his proof
router.delete(
  "/:id",
  requireAuth,
  controller.delete
);

export default router;