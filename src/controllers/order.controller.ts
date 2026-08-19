import type {
  Response,
} from "express";

import type {
  AuthRequest,
} from "../middlewares/auth.middleware.js";

import { OrderService } from "../services/order.service.js";
import { OrderResponse } from "../responses/order.respose.js";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  // =========================
  // CREATE ORDER
  // =========================

  createOrder = async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const userId = req.user!.userId;

      const order =
        await this.orderService.createOrder({
          ...req.body,
          userId,
        });

      return res.status(201).json({
        success: true,
        data: OrderResponse.fromOrder(order),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  // =========================
  // GET MY ORDERS
  // =========================

  getMyOrders = async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const userId = req.user!.userId;

      const orders =
        await this.orderService.getOrdersByUser(
          userId
        );

      return res.status(200).json({
        success: true,
        data: OrderResponse.fromOrders(orders),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  // =========================
  // GET ORDER BY ID
  // =========================

  getOrderById = async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const isAdmin =
        req.user!.role === "ADMIN" ||
        req.user!.role === "SUPER_ADMIN";

      const order =
        await this.orderService.getOrderById(
          id,
          isAdmin
            ? undefined
            : req.user!.userId
        );

      return res.status(200).json({
        success: true,
        data: OrderResponse.fromOrder(order),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  // =========================
  // GET ALL ORDERS
  // =========================

  getOrders = async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const orders =
        await this.orderService.getOrders();

      return res.status(200).json({
        success: true,
        data: OrderResponse.fromOrders(orders),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  updateOrderStatus = async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const order =
        await this.orderService.updateOrderStatus(
          id,
          req.body.status,
          req.user!.userId
        );

      return res.status(200).json({
        success: true,
        data: OrderResponse.fromOrder(order),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  // =========================
  // ERROR HANDLER
  // =========================

  private handleError(
    res: Response,
    error: any
  ) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    if (
      message === "User not found" ||
      message === "Order not found"
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (
      message.includes("Duplicate") ||
      message.includes("Insufficient stock")
    ) {
      return res.status(409).json({
        success: false,
        message,
      });
    }

    if (
      message.startsWith("Invalid") ||
      message.includes("required") ||
      message.includes("at least") ||
      message.includes("must be") ||
      message.includes("not found or inactive")
    ) {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
}