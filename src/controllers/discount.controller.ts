import type {
  Request,
  Response,
} from "express";

import { DiscountService } from "../services/discount.service.js";
import { DiscountResponse } from "../responses/discount.response.js";

export class DiscountController {
  private discountService: DiscountService;

  constructor() {
    this.discountService =
      new DiscountService();
  }

  createDiscount = async (
    req: Request,
    res: Response
  ) => {
    try {
      const discount =
        await this.discountService.createDiscount(
          req.body
        );

      return res.status(201).json({
        success: true,
        data: DiscountResponse.fromDiscount(
          discount
        ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getDiscounts = async (
    req: Request,
    res: Response
  ) => {
    try {
      const discounts =
        await this.discountService.getDiscounts();

      return res.status(200).json({
        success: true,
        data: DiscountResponse.fromDiscounts(
          discounts
        ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getDiscountById = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const discount =
        await this.discountService.getDiscountById(
          id
        );

      return res.status(200).json({
        success: true,
        data: DiscountResponse.fromDiscount(
          discount
        ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  updateDiscount = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const discount =
        await this.discountService.updateDiscount(
          id,
          req.body
        );

      return res.status(200).json({
        success: true,
        data: DiscountResponse.fromDiscount(
          discount
        ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  deleteDiscount = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      await this.discountService.deleteDiscount(
        id
      );

      return res.status(200).json({
        success: true,
        message: "Discount deleted successfully",
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
      message === "Product not found" ||
      message === "Discount not found"
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (
      message.includes("required") ||
      message.includes("Invalid") ||
      message.includes("greater") ||
      message.includes("after") ||
      message.includes("inactive")
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