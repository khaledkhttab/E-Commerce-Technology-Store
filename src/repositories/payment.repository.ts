import prisma from "../config/prisma.js";

export class PaymentRepository {
  async create(
    orderId: number,
    paymentMethod: any,
    paymentStatus: any
  ) {
    return prisma.payment.create({
      data: {
        orderId,
        paymentMethod,
        paymentStatus,
      },
      include: {
        order: true,
        proof: true,
      },
    });
  }

  async findById(id: number) {
    return prisma.payment.findUnique({
      where: {
        id,
      },
      include: {
        order: true,
        proof: true,
      },
    });
  }

  async findByOrderId(orderId: number) {
    return prisma.payment.findUnique({
      where: {
        orderId,
      },
      include: {
        order: true,
        proof: true,
      },
    });
  }

  async findMany() {
    return prisma.payment.findMany({
      include: {
        order: true,
        proof: true,
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  async updateStatus(
    id: number,
    paymentStatus: any
  ) {
    return prisma.payment.update({
      where: {
        id,
      },
      data: {
        paymentStatus,
        paidAt:
          paymentStatus === "VERIFIED"
            ? new Date()
            : undefined,
      },
      include: {
        order: true,
        proof: true,
      },
    });
  }
}