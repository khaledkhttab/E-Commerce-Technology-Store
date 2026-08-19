import prisma from "../config/prisma.js";

export class OrderRepository {
  // =========================
  // CREATE ORDER
  // =========================

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
    return prisma.$transaction(
      async (tx) => {
        // =========================
        // CREATE ORDER
        // =========================

        const order =
          await tx.order.create({
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

        // =========================
        // CREATE ORDER ITEMS
        // + ATOMIC STOCK DECREMENT
        // =========================

        for (const item of items) {
          /*
           * Update stock only if:
           * 1. Product exists
           * 2. Product is active
           * 3. Available stock >= requested quantity
           *
           * This prevents overselling when multiple
           * orders are created at the same time.
           */

          const updatedProduct =
            await tx.product.updateMany({
              where: {
                id: item.productId,
                isActive: true,
                stockQuantity: {
                  gte: item.quantity,
                },
              },
              data: {
                stockQuantity: {
                  decrement: item.quantity,
                },
              },
            });

          // =========================
          // STOCK VALIDATION
          // =========================

          if (updatedProduct.count === 0) {
            throw new Error(
              `Insufficient stock for product: ${item.productName}`
            );
          }

          // =========================
          // CREATE ORDER ITEM
          // =========================

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
        }

        // =========================
        // RETURN CREATED ORDER
        // =========================

        return tx.order.findUnique({
          where: {
            id: order.id,
          },
          include: {
            items: true,
          },
        });
      }
    );
  }

  // =========================
  // FIND ORDER BY ID
  // =========================

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

  // =========================
  // FIND ALL ORDERS
  // =========================

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

  // =========================
  // FIND ORDERS BY USER
  // =========================

  async findByUserId(
    userId: number
  ) {
    return prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: true,
        payment: true,
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  async updateStatus(
    id: number,
    status: any,
    adminId: number
  ) {
    return prisma.$transaction(
      async (tx) => {
        // =========================
        // UPDATE ORDER STATUS
        // =========================

        const order =
          await tx.order.update({
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

        // =========================
        // CREATE STATUS HISTORY
        // =========================

        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            adminId,
            status,
          },
        });

        // =========================
        // RETURN UPDATED ORDER
        // =========================

        return order;
      }
    );
  }
}