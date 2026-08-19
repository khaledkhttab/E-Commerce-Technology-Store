import prisma from "../config/prisma.js";

export class BrandRepository {
  async findMany() {
    return prisma.brand.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  async findById(id: number) {
    return prisma.brand.findUnique({
      where: { id },
    });
  }

  async create(name: string) {
    return prisma.brand.create({
      data: {
        name,
      },
    });
  }

  async update(id: number, name: string) {
    return prisma.brand.update({
      where: { id },
      data: {
        name,
      },
    });
  }

  async hasProducts(id: number) {
    const count = await prisma.product.count({
      where: {
        brandId: id,
      },
    });

    return count > 0;
  }

  async delete(id: number) {
    return prisma.brand.delete({
      where: { id },
    });
  }
}