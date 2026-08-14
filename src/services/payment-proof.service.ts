import prisma from "../config/prisma.js";
import { PaymentProofRepository } from "../repositories/payment-proof.repository.js";

export class PaymentProofService {
  private paymentProofRepository: PaymentProofRepository;

  constructor() {
    this.paymentProofRepository = new PaymentProofRepository();
  }

  async createPaymentProof(
    paymentId: number,
    proofImageUrl: string
  ) {
    if (!paymentId) {
      throw new Error("Payment ID is required");
    }

    if (!proofImageUrl || proofImageUrl.trim() === "") {
      throw new Error("Proof image URL is required");
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    const existingProof =
      await this.paymentProofRepository.findByPaymentId(paymentId);

    if (existingProof) {
      throw new Error("Payment proof already exists for this payment");
    }

    return this.paymentProofRepository.create(
      paymentId,
      proofImageUrl.trim()
    );
  }

  async getPaymentProofById(id: number) {
    if (!id) {
      throw new Error("Payment Proof ID is required");
    }

    const proof =
      await this.paymentProofRepository.findById(id);

    if (!proof) {
      throw new Error("Payment proof not found");
    }

    return proof;
  }

  async getPaymentProofs() {
    return this.paymentProofRepository.findMany();
  }

  async getPaymentProofByPaymentId(paymentId: number) {
    if (!paymentId) {
      throw new Error("Payment ID is required");
    }

    const proof =
      await this.paymentProofRepository.findByPaymentId(paymentId);

    if (!proof) {
      throw new Error("Payment proof not found");
    }

    return proof;
  }

  async updatePaymentProof(
    id: number,
    proofImageUrl: string
  ) {
    if (!id) {
      throw new Error("Payment Proof ID is required");
    }

    if (!proofImageUrl || proofImageUrl.trim() === "") {
      throw new Error("Proof image URL is required");
    }

    const proof =
      await this.paymentProofRepository.findById(id);

    if (!proof) {
      throw new Error("Payment proof not found");
    }

    return this.paymentProofRepository.update(
      id,
      proofImageUrl.trim()
    );
  }

  async deletePaymentProof(id: number) {
    if (!id) {
      throw new Error("Payment Proof ID is required");
    }

    const proof =
      await this.paymentProofRepository.findById(id);

    if (!proof) {
      throw new Error("Payment proof not found");
    }

    return this.paymentProofRepository.delete(id);
  }
}