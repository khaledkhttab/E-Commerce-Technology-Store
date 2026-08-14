import type { Request, Response } from "express";
import { OrderService } from "../services/order.service.js";
import { OrderResponse } from "../responses/order.respose.js";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = async (
    req: Request,
    res: Response
  ) => {
    try {
      const order =
        await this.orderService.createOrder(
          req.body
        );

      return res.status(201).json({
        success: true,
        data: OrderResponse.fromOrder(order),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getOrderById = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const order =
        await this.orderService.getOrderById(id);

      return res.status(200).json({
        success: true,
        data: OrderResponse.fromOrder(order),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getOrders = async (
    req: Request,
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

  updateOrderStatus = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const order =
        await this.orderService.updateOrderStatus(
          id,
          req.body.status
        );

      return res.status(200).json({
        success: true,
        data: OrderResponse.fromOrder(order),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

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