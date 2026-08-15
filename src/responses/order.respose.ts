export class OrderResponse {
  static fromOrder(order: any) {
    const items = order.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      unitPrice: Number(item.unitPrice),
      quantity: item.quantity,
      discount: Number(item.discount),
      subtotal: Number(item.subtotal),
    }));

    const totalItems = items.reduce(
      (total: number, item: any) => total + item.quantity,
      0
    );

    const totalPrice = items.reduce(
      (total: number, item: any) => total + item.subtotal,
      0
    );

    return {
      id: order.id,
      orderNumber: order.orderNumber,

      userId: order.userId,

      customerEmail: order.customerEmail,
      phoneNumber: order.phoneNumber,
      backupPhone: order.backupPhone,
      shippingAddress: order.shippingAddress,

      status: order.status,

      items,
      totalItems,
      totalPrice,

      payment: order.payment
        ? {
            id: order.payment.id,
            paymentMethod: order.payment.paymentMethod,
            paymentStatus: order.payment.paymentStatus,
            paidAt: order.payment.paidAt,
          }
        : null,

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static fromOrders(orders: any[]) {
    return orders.map((order: any) =>
      OrderResponse.fromOrder(order)
    );
  }
}