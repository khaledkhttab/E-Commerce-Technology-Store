import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import {
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware.js";

const router = Router();

const orderController =
  new OrderController();

router.post(
  "/",
  requireAuth,
  orderController.createOrder
);

router.get(
  "/",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  orderController.getOrders
);

router.get(
  "/:id",
  requireAuth,
  orderController.getOrderById
);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  orderController.updateOrderStatus
);

export default router;