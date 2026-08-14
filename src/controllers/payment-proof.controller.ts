import type { Request, Response } from "express";
import { PaymentProofService } from "../services/payment-proof.service.js";

export class PaymentProofController {
  private paymentProofService: PaymentProofService;

  constructor() {
    this.paymentProofService = new PaymentProofService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const { paymentId, proofImageUrl } = req.body;

      const proof =
        await this.paymentProofService.createPaymentProof(
          Number(paymentId),
          proofImageUrl
        );

      res.status(201).json({
        success: true,
        data: proof,
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
      const proofs =
        await this.paymentProofService.getPaymentProofs();

      res.json({
        success: true,
        data: proofs,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const proof =
        await this.paymentProofService.getPaymentProofById(id);

      res.json({
        success: true,
        data: proof,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getByPaymentId = async (req: Request, res: Response) => {
    try {
      const paymentId = Number(req.params.paymentId);

      const proof =
        await this.paymentProofService
          .getPaymentProofByPaymentId(paymentId);

      res.json({
        success: true,
        data: proof,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { proofImageUrl } = req.body;

      const proof =
        await this.paymentProofService.updatePaymentProof(
          id,
          proofImageUrl
        );

      res.json({
        success: true,
        data: proof,
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

      await this.paymentProofService.deletePaymentProof(id);

      res.json({
        success: true,
        message: "Payment proof deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}