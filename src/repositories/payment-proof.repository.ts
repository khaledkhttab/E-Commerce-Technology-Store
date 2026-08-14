import prisma from "../config/prisma.js";

export class PaymentProofRepository {
  async create(paymentId: number, proofImageUrl: string) {
    return prisma.paymentProof.create({
      data: {
        paymentId,
        proofImageUrl,
      },
      include: {
        payment: true,
      },
    });
  }

  async findById(id: number) {
    return prisma.paymentProof.findUnique({
      where: { id },
      include: {
        payment: true,
      },
    });
  }

  async findByPaymentId(paymentId: number) {
    return prisma.paymentProof.findUnique({
      where: { paymentId },
      include: {
        payment: true,
      },
    });
  }

  async findMany() {
    return prisma.paymentProof.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        payment: true,
      },
    });
  }

  async update(id: number, proofImageUrl: string) {
    return prisma.paymentProof.update({
      where: { id },
      data: {
        proofImageUrl,
      },
      include: {
        payment: true,
      },
    });
  }

  async delete(id: number) {
    return prisma.paymentProof.delete({
      where: { id },
    });
  }
}