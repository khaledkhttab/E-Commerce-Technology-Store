import prisma from "../config/prisma.js";

export class KeywordRepository {
  async create(name: string) {
    return prisma.keyword.create({
      data: {
        name,
      },
    });
  }

  async findById(id: number) {
    return prisma.keyword.findUnique({
      where: { id },
    });
  }

  async findMany() {
    return prisma.keyword.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  async update(id: number, name: string) {
    return prisma.keyword.update({
      where: { id },
      data: {
        name,
      },
    });
  }

  async delete(id: number) {
    return prisma.keyword.delete({
      where: { id },
    });
  }
}