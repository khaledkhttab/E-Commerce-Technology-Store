import { OrderRepository } from "../repositories/order.repository.js";
import prisma from "../config/prisma.js";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async createOrder(data: any) {
    if (!data.userId) {
      throw new Error("User ID is required");
    }

    if (!Number.isInteger(data.userId) || data.userId <= 0) {
      throw new Error("Invalid user ID");
    }

    if (!data.items || !Array.isArray(data.items)) {
      throw new Error("Order items are required");
    }

    if (data.items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const productIds = data.items.map(
      (item: any) => item.productId
    );

    const uniqueProductIds = [
      ...new Set(productIds),
    ];

    if (
      uniqueProductIds.length !== productIds.length
    ) {
      throw new Error(
        "Duplicate products are not allowed in an order"
      );
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: uniqueProductIds as number[],
        },
        isActive: true,
      },
    });

    if (
      products.length !== uniqueProductIds.length
    ) {
      throw new Error(
        "One or more products not found or inactive"
      );
    }

    const orderItems: any[] = [];

    for (const item of data.items) {
      if (
        !Number.isInteger(item.productId) ||
        item.productId <= 0
      ) {
        throw new Error("Invalid product ID");
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        throw new Error(
          "Order quantity must be greater than 0"
        );
      }

      const product = products.find(
        (p) => p.id === item.productId
      );

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stockQuantity < item.quantity) {
        throw new Error(
          `Insufficient stock for product: ${product.name}`
        );
      }

      const unitPrice = Number(product.price);

      const subtotal =
        unitPrice * item.quantity;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        unitPrice,
        quantity: item.quantity,
        discount: 0,
        subtotal,
      });
    }

    const total = orderItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const orderNumber =
      `ORD-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

    return this.orderRepository.create(
      data.userId,
      orderNumber,
      orderItems,
      total
    );
  }

  async getOrderById(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid order ID");
    }

    const order =
      await this.orderRepository.findById(id);

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }

  async getOrders() {
    return this.orderRepository.findMany();
  }

  async updateOrderStatus(
    id: number,
    status: string
  ) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid order ID");
    }

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      throw new Error("Invalid order status");
    }

    const order =
      await this.orderRepository.findById(id);

    if (!order) {
      throw new Error("Order not found");
    }

    return this.orderRepository.updateStatus(
      id,
      status
    );
  }
}