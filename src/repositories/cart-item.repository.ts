import prisma from "../config/prisma.js";

export class CartItemRepository {
  async findById(id: number) {
    return prisma.cartItem.findUnique({
      where: {
        id,
      },
      include: {
        product: true,
        cart: true,
      },
    });
  }

  async findByCartAndProduct(cartId: number, productId: number) {
    return prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      include: {
        product: true,
      },
    });
  }

  async create(cartId: number, productId: number, quantity: number) {
    return prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });
  }

  async updateQuantity(id: number, quantity: number) {
    return prisma.cartItem.update({
      where: {
        id,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });
  }

  async delete(id: number) {
    return prisma.cartItem.delete({
      where: {
        id,
      },
    });
  }
}