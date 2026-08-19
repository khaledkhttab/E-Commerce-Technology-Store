import type { Request, Response } from "express";
import { ProductService } from "../services/product.service.js";
import { ProductResponse } from "../responses/product.response.js";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (
    req: Request,
    res: Response
  ) => {
    try {
      const product =
        await this.productService.createProduct(
          req.body
        );

      return res.status(201).json({
        success: true,
        data: ProductResponse.fromProduct(product),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getProductById = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const product =
        await this.productService.getProductById(id);

      return res.status(200).json({
        success: true,
        data: ProductResponse.fromProduct(product),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getProducts = async (
    req: Request,
    res: Response
  ) => {
    try {
      const products =
        await this.productService.getProducts();

      return res.status(200).json({
        success: true,
        data: ProductResponse.fromProducts(products),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  updateProduct = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const product =
        await this.productService.updateProduct(
          id,
          req.body
        );

      return res.status(200).json({
        success: true,
        data: ProductResponse.fromProduct(product),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  updateStock = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const product =
        await this.productService.updateStock(
          id,
          req.body.stockQuantity
        );

      return res.status(200).json({
        success: true,
        data: ProductResponse.fromProduct(product),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  deactivateProduct = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const product =
        await this.productService.deactivateProduct(
          id
        );

      return res.status(200).json({
        success: true,
        data: ProductResponse.fromProduct(product),
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

        if (message === "Invalid product ID") {
  return res.status(400).json({
    success: false,
    message,
  });
}

    if (
      message === "Product not found" ||
      message === "Brand not found" ||
      message === "One or more categories not found"
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (
      message.includes("price") ||
      message.includes("Stock") ||
      message.includes("stock") ||
      message.includes("category")
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