import type { Request, Response } from "express";
import { BrandService } from "../services/brand.service.js";

export class BrandController {
  private brandService: BrandService;

  constructor() {
    this.brandService = new BrandService();
  }

  async getBrands(req: Request, res: Response) {
    try {
      const brands = await this.brandService.getBrands();

      return res.status(200).json({
        success: true,
        data: brands,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getBrandById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const brand = await this.brandService.getBrandById(id);

      return res.status(200).json({
        success: true,
        data: brand,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createBrand(req: Request, res: Response) {
    try {
      const { name } = req.body;

      const brand = await this.brandService.createBrand(name);

      return res.status(201).json({
        success: true,
        message: "Brand created successfully",
        data: brand,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateBrand(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { name } = req.body;

      const brand = await this.brandService.updateBrand(id, name);

      return res.status(200).json({
        success: true,
        message: "Brand updated successfully",
        data: brand,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteBrand(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      await this.brandService.deleteBrand(id);

      return res.status(200).json({
        success: true,
        message: "Brand deleted successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}