import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";

const router = Router();

const orderController =
  new OrderController();

router.post(
  "/",
  orderController.createOrder
);

router.get(
  "/",
  orderController.getOrders
);

router.get(
  "/:id",
  orderController.getOrderById
);

router.patch(
  "/:id/status",
  orderController.updateOrderStatus
);

export default router;