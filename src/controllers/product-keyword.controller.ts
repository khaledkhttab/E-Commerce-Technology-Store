import type { Request, Response } from "express";
import { ProductKeywordService } from "../services/product-keyword.service.js";

export class ProductKeywordController {
  private productKeywordService: ProductKeywordService;

  constructor() {
    this.productKeywordService = new ProductKeywordService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const { productId, keywordId } = req.body;

      const result =
        await this.productKeywordService.createProductKeyword(
          Number(productId),
          Number(keywordId)
        );

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const result =
        await this.productKeywordService.getProductKeywords();

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getByProduct = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.productId);

      const result =
        await this.productKeywordService.getKeywordsByProduct(
          productId
        );

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getByKeyword = async (req: Request, res: Response) => {
    try {
      const keywordId = Number(req.params.keywordId);

      const result =
        await this.productKeywordService.getProductsByKeyword(
          keywordId
        );

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.productId);
      const keywordId = Number(req.params.keywordId);

      await this.productKeywordService.deleteProductKeyword(
        productId,
        keywordId
      );

      res.json({
        success: true,
        message: "Product keyword relationship deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}