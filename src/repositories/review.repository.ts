import prisma from "../config/prisma.js";

export class ReviewRepository {
  async create(data: {
    userId: number;
    productId: number;
    rating: number;
    comment: string;
  }) {
    return prisma.review.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: true,
        product: true,
      },
    });
  }

  async findById(id: number) {
    return prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    });
  }

  async findMany() {
    return prisma.review.findMany({
      include: {
        user: true,
        product: true,
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  async findByUserAndProduct(
    userId: number,
    productId: number
  ) {
    return prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async update(
    id: number,
    data: {
      rating?: number;
      comment?: string;
    }
  ) {
    return prisma.review.update({
      where: { id },
      data,
      include: {
        user: true,
        product: true,
      },
    });
  }

  async delete(id: number) {
    return prisma.review.delete({
      where: { id },
    });
  }
}