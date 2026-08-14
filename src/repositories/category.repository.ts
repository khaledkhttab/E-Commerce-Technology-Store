import prisma from "../config/prisma.js";
import { CategoryType } from "../generated/prisma/index.js";

export class CategoryRepository {
  async create(data: {
    name: string;
    type: CategoryType;
  }) {
    return prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
      },
    });
  }

  async findById(id: number) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  // Keep this because ProductService uses it
  async findByIds(ids: number[]) {
    return prisma.category.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findByName(name: string) {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  async findMany(type?: CategoryType) {
    return prisma.category.findMany({
      where: type
        ? {
            type,
          }
        : undefined,
      orderBy: {
        id: "asc",
      },
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      type?: CategoryType;
    }
  ) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async countProducts(id: number) {
    return prisma.productCategory.count({
      where: {
        categoryId: id,
      },
    });
  }

  async delete(id: number) {
    return prisma.category.delete({
      where: { id },
    });
  }
}