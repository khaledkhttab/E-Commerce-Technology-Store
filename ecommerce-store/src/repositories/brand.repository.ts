import prisma from "../config/prisma.js";

export class BrandRepository {
  async findById(id: number) {
    return prisma.brand.findUnique({
      where: { id },
    });
  }
}