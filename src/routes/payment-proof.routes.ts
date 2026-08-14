import { Router } from "express";
import { PaymentProofController } from "../controllers/payment-proof.controller.js";

const router = Router();

const controller = new PaymentProofController();

router.post("/", controller.create);

router.get("/", controller.getAll);

router.get("/payment/:paymentId", controller.getByPaymentId);

router.get("/:id", controller.getById);

router.patch("/:id", controller.update);

router.delete("/:id", controller.delete);

export default router;