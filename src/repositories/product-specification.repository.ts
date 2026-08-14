import prisma from "../config/prisma.js";

export class ProductSpecificationRepository {
  async create(data: any) {
    return prisma.productSpecification.create({
      data: {
        productId: data.productId,
        name: data.name,
        value: data.value,
      },
      include: {
        product: true,
      },
    });
  }

  async findById(id: number) {
    return prisma.productSpecification.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
  }

  async findMany() {
    return prisma.productSpecification.findMany({
      include: {
        product: true,
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  async findByProductId(productId: number) {
    return prisma.productSpecification.findMany({
      where: {
        productId,
      },
      include: {
        product: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  async update(id: number, data: any) {
    return prisma.productSpecification.update({
      where: { id },
      data,
      include: {
        product: true,
      },
    });
  }

  async delete(id: number) {
    return prisma.productSpecification.delete({
      where: { id },
    });
  }
}