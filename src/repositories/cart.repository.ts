import prisma from "../config/prisma.js";

export class CartRepository {
  async getCartByUserId(userId: number) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true,
                categories: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

async createCart(userId: number) {
  return prisma.cart.create({
    data: {
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              brand: true,
              categories: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

  async findCartItem(cartId: number, productId: number) {
    return prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  }

  async addItem(
    cartId: number,
    productId: number,
    quantity: number
  ) {
    return prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });
  }

  async updateItemQuantity(
    cartId: number,
    productId: number,
    quantity: number
  ) {
    return prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });
  }

  async removeItem(cartId: number, productId: number) {
    return prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  }

  async clearCart(cartId: number) {
    return prisma.cartItem.deleteMany({
      where: {
        cartId,
      },
    });
  }
}