import prisma from "../config/prisma.js";

export class DiscountRepository {
  async create(data: any) {
    return prisma.discount.create({
      data: {
        value: data.value,
        startDate: data.startDate,
        endDate: data.endDate,
        productId: data.productId,
      },
      include: {
        product: true,
      },
    });
  }

  async findById(id: number) {
    return prisma.discount.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
  }

  async findMany() {
    return prisma.discount.findMany({
      include: {
        product: true,
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  async update(id: number, data: any) {
    return prisma.discount.update({
      where: { id },
      data,
      include: {
        product: true,
      },
    });
  }

  async delete(id: number) {
    return prisma.discount.delete({
      where: { id },
    });
  }
}