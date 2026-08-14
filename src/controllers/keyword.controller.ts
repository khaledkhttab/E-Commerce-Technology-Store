import type { Request, Response } from "express";
import { KeywordService } from "../services/keyword.service.js";

export class KeywordController {
  private keywordService: KeywordService;

  constructor() {
    this.keywordService = new KeywordService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;

      const keyword =
        await this.keywordService.createKeyword(name);

      res.status(201).json({
        success: true,
        data: keyword,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const keyword =
        await this.keywordService.getKeywordById(id);

      res.json({
        success: true,
        data: keyword,
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
      const keywords =
        await this.keywordService.getKeywords();

      res.json({
        success: true,
        data: keywords,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { name } = req.body;

      const keyword =
        await this.keywordService.updateKeyword(id, name);

      res.json({
        success: true,
        data: keyword,
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
      const id = Number(req.params.id);

      await this.keywordService.deleteKeyword(id);

      res.json({
        success: true,
        message: "Keyword deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}