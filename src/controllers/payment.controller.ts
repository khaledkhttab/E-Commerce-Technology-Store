import type {
  Request,
  Response,
} from "express";

import { PaymentService } from "../services/payment.service.js";
import { PaymentResponse } from "../responses/payment.response.js";

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService =
      new PaymentService();
  }

  createPayment = async (
    req: Request,
    res: Response
  ) => {
    try {
      const payment =
        await this.paymentService.createPayment(
          req.body
        );

      return res.status(201).json({
        success: true,
        data: PaymentResponse.fromPayment(
          payment
        ),
      });
    } catch (error: any) {
      return this.handleError(
        res,
        error
      );
    }
  };

  getPaymentById = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(
        req.params.id
      );

      const payment =
        await this.paymentService.getPaymentById(
          id
        );

      return res.status(200).json({
        success: true,
        data: PaymentResponse.fromPayment(
          payment
        ),
      });
    } catch (error: any) {
      return this.handleError(
        res,
        error
      );
    }
  };

  getPayments = async (
    req: Request,
    res: Response
  ) => {
    try {
      const payments =
        await this.paymentService.getPayments();

      return res.status(200).json({
        success: true,
        data: PaymentResponse.fromPayments(
          payments
        ),
      });
    } catch (error: any) {
      return this.handleError(
        res,
        error
      );
    }
  };

  updatePaymentStatus = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(
        req.params.id
      );

      const payment =
        await this.paymentService.updatePaymentStatus(
          id,
          req.body.paymentStatus
        );

      return res.status(200).json({
        success: true,
        data: PaymentResponse.fromPayment(
          payment
        ),
      });
    } catch (error: any) {
      return this.handleError(
        res,
        error
      );
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
      message === "Order not found" ||
      message === "Payment not found"
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (
      message.includes(
        "already exists"
      ) ||
      message.includes(
        "Verified payment"
      )
    ) {
      return res.status(409).json({
        success: false,
        message,
      });
    }

    if (
      message.includes("required") ||
      message.includes("Invalid")
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