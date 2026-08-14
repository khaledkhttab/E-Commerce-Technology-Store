import type {
  Request,
  Response,
} from "express";

import { ProductSpecificationService } from "../services/product-specification.service.js";
import { ProductSpecificationResponse } from "../responses/product-specification.response.js";

export class ProductSpecificationController {
  private specificationService: ProductSpecificationService;

  constructor() {
    this.specificationService =
      new ProductSpecificationService();
  }

  createSpecification = async (
    req: Request,
    res: Response
  ) => {
    try {
      const specification =
        await this.specificationService.createSpecification(
          req.body
        );

      return res.status(201).json({
        success: true,
        data:
          ProductSpecificationResponse.fromSpecification(
            specification
          ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getSpecifications = async (
    req: Request,
    res: Response
  ) => {
    try {
      const specifications =
        await this.specificationService.getSpecifications();

      return res.status(200).json({
        success: true,
        data:
          ProductSpecificationResponse.fromSpecifications(
            specifications
          ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getSpecificationById = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const specification =
        await this.specificationService.getSpecificationById(
          id
        );

      return res.status(200).json({
        success: true,
        data:
          ProductSpecificationResponse.fromSpecification(
            specification
          ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getSpecificationsByProductId = async (
    req: Request,
    res: Response
  ) => {
    try {
      const productId = Number(
        req.params.productId
      );

      const specifications =
        await this.specificationService.getSpecificationsByProductId(
          productId
        );

      return res.status(200).json({
        success: true,
        data:
          ProductSpecificationResponse.fromSpecifications(
            specifications
          ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  updateSpecification = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const specification =
        await this.specificationService.updateSpecification(
          id,
          req.body
        );

      return res.status(200).json({
        success: true,
        data:
          ProductSpecificationResponse.fromSpecification(
            specification
          ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  deleteSpecification = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      await this.specificationService.deleteSpecification(
        id
      );

      return res.status(200).json({
        success: true,
        message:
          "Product specification deleted successfully",
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
      message ===
        "Product specification not found"
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (
      message.includes("required") ||
      message.includes("Invalid") ||
      message.includes("inactive") ||
      message.includes("empty")
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