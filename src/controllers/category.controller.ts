import type { Request, Response } from "express";
import { CategoryService } from "../services/category.service.js";
import { CategoryResponse } from "../responses/category.response.js";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  createCategory = async (
    req: Request,
    res: Response
  ) => {
    try {
      const category =
        await this.categoryService.createCategory(req.body);

      return res.status(201).json({
        success: true,
        data: CategoryResponse.from(category),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getCategoryById = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const category =
        await this.categoryService.getCategoryById(id);

      return res.status(200).json({
        success: true,
        data: CategoryResponse.from(category),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getCategories = async (
    req: Request,
    res: Response
  ) => {
    try {
      const type =
        typeof req.query.type === "string"
          ? req.query.type
          : undefined;

      const categories =
        await this.categoryService.getCategories(type);

      return res.status(200).json({
        success: true,
        data: CategoryResponse.fromMany(categories),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  updateCategory = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const category =
        await this.categoryService.updateCategory(
          id,
          req.body
        );

      return res.status(200).json({
        success: true,
        data: CategoryResponse.from(category),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  deleteCategory = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const result =
        await this.categoryService.deleteCategory(id);

      return res.status(200).json({
        success: true,
        ...result,
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

    if (message === "Category not found") {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (
      message ===
      "Category with this name already exists"
    ) {
      return res.status(409).json({
        success: false,
        message,
      });
    }

    if (
      message ===
      "Cannot delete category because it is associated with products"
    ) {
      return res.status(409).json({
        success: false,
        message,
      });
    }

    if (
      message.startsWith("Invalid") ||
      message.includes("cannot be empty") ||
      message.includes("must be a string") ||
      message.includes("At least one field")
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