import type {
  Request,
  Response,
} from "express";

import { PaymentProofService } from "../services/payment-proof.service.js";

import type {
  AuthRequest,
} from "../middlewares/auth.middleware.js";

export class PaymentProofController {
  private paymentProofService: PaymentProofService;

  constructor() {
    this.paymentProofService =
      new PaymentProofService();
  }

  // Customer creates payment proof
  create = async (
    req: Request,
    res: Response
  ) => {
    try {
      const authReq =
        req as AuthRequest;

      const {
        paymentId,
        proofImageUrl,
      } = req.body;

      const proof =
        await this.paymentProofService.createPaymentProof(
          Number(paymentId),
          authReq.user!.userId,
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

  // Admins can view all proofs
  getAll = async (
    req: Request,
    res: Response
  ) => {
    try {
      const proofs =
        await this.paymentProofService
          .getPaymentProofs();

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

  // Admins can inspect a specific proof
  getById = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id =
        Number(req.params.id);

      const proof =
        await this.paymentProofService
          .getPaymentProofById(id);

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

  // Customer can access his own proof
  getByPaymentId = async (
    req: Request,
    res: Response
  ) => {
    try {
      const authReq =
        req as AuthRequest;

      const paymentId =
        Number(req.params.paymentId);

      const proof =
        await this.paymentProofService
          .getPaymentProofByPaymentId(
            paymentId,
            authReq.user!.userId
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

  // Customer can update his own proof
  update = async (
    req: Request,
    res: Response
  ) => {
    try {
      const authReq =
        req as AuthRequest;

      const id =
        Number(req.params.id);

      const {
        proofImageUrl,
      } = req.body;

      const proof =
        await this.paymentProofService
          .updatePaymentProof(
            id,
            authReq.user!.userId,
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

  // Customer can delete his own proof
  delete = async (
    req: Request,
    res: Response
  ) => {
    try {
      const authReq =
        req as AuthRequest;

      const id =
        Number(req.params.id);

      await this.paymentProofService
        .deletePaymentProof(
          id,
          authReq.user!.userId
        );

      res.json({
        success: true,
        message:
          "Payment proof deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}