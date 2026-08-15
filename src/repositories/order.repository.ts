import prisma from "../config/prisma.js";

export class OrderRepository {
  async create(
    userId: number,
    orderNumber: string,
    items: any[],
    total: number,
    customerEmail: string,
    phoneNumber: string,
    backupPhone: string | null,
    shippingAddress: string
  ) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber,
          status: "PENDING",

          customerEmail,
          phoneNumber,
          backupPhone,
          shippingAddress,
        },
      });

      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            productName: item.productName,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            discount: item.discount,
            subtotal: item.subtotal,
          },
        });

        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return tx.order.findUnique({
        where: {
          id: order.id,
        },
        include: {
          items: true,
        },
      });
    });
  }

  async findById(id: number) {
    return prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
        payment: true,
      },
    });
  }

  async findMany() {
    return prisma.order.findMany({
      include: {
        items: true,
        payment: true,
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  async updateStatus(
    id: number,
    status: any
  ) {
    return prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        items: true,
        payment: true,
      },
    });
  }
}