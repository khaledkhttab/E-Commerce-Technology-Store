import prisma from "../config/prisma.js";

export class ProductRepository {
  async create(data: any) {
    const { categoryIds, ...productData } = data;

    return prisma.product.create({
      data: {
        ...productData,

        categories: {
          create: categoryIds.map((categoryId: number) => ({
            category: {
              connect: {
                id: categoryId,
              },
            },
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        brand: true,
      },
    });
  }

  async findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async findMany() {
    return prisma.product.findMany();
  }

async update(id: number, data: any) {
  const { categoryIds, ...productData } = data;

  return prisma.$transaction(async (tx) => {
    if (categoryIds !== undefined) {
      await tx.productCategory.deleteMany({
        where: {
          productId: id,
        },
      });

      await tx.productCategory.createMany({
        data: categoryIds.map((categoryId: number) => ({
          productId: id,
          categoryId,
        })),
      });
    }

    return tx.product.update({
      where: { id },
      data: productData,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        brand: true,
      },
    });
  });
}

  async updateStock(id: number, stockQuantity: number) {
    return prisma.product.update({
      where: { id },
      data: {
        stockQuantity,
      },
    });
  }

  async deactivate(id: number) {
    return prisma.product.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}