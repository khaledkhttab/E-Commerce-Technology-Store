import prisma from "../config/prisma.js";

export class CategoryRepository {
  async findById(id: number) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findByIds(ids: number[]) {
    return prisma.category.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}