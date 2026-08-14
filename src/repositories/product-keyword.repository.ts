import prisma from "../config/prisma.js";

export class ProductKeywordRepository {
  async create(productId: number, keywordId: number) {
    return prisma.productKeyword.create({
      data: {
        productId,
        keywordId,
      },
      include: {
        product: true,
        keyword: true,
      },
    });
  }

  async findAll() {
    return prisma.productKeyword.findMany({
      include: {
        product: true,
        keyword: true,
      },
    });
  }

  async findByProductId(productId: number) {
    return prisma.productKeyword.findMany({
      where: {
        productId,
      },
      include: {
        product: true,
        keyword: true,
      },
    });
  }

  async findByKeywordId(keywordId: number) {
    return prisma.productKeyword.findMany({
      where: {
        keywordId,
      },
      include: {
        product: true,
        keyword: true,
      },
    });
  }

  async findByIds(productId: number, keywordId: number) {
    return prisma.productKeyword.findUnique({
      where: {
        productId_keywordId: {
          productId,
          keywordId,
        },
      },
      include: {
        product: true,
        keyword: true,
      },
    });
  }

  async delete(productId: number, keywordId: number) {
    return prisma.productKeyword.delete({
      where: {
        productId_keywordId: {
          productId,
          keywordId,
        },
      },
    });
  }
}