import { OrderRepository } from "../repositories/order.repository.js";
import prisma from "../config/prisma.js";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  // =========================
  // CREATE ORDER
  // =========================

  async createOrder(data: any) {
    // =========================
    // USER VALIDATION
    // =========================

    if (!data.userId) {
      throw new Error("User ID is required");
    }

    if (
      !Number.isInteger(data.userId) ||
      data.userId <= 0
    ) {
      throw new Error("Invalid user ID");
    }

    // =========================
    // CUSTOMER CONTACT INFO
    // =========================

    if (
      !data.customerEmail ||
      typeof data.customerEmail !== "string"
    ) {
      throw new Error("Customer email is required");
    }

    const customerEmail =
      data.customerEmail
        .trim()
        .toLowerCase();

    if (!customerEmail) {
      throw new Error(
        "Customer email cannot be empty"
      );
    }

    if (!this.isValidEmail(customerEmail)) {
      throw new Error(
        "Invalid customer email format"
      );
    }

    if (
      !data.phoneNumber ||
      typeof data.phoneNumber !== "string"
    ) {
      throw new Error("Phone number is required");
    }

    const phoneNumber =
      data.phoneNumber.trim();

    if (!phoneNumber) {
      throw new Error(
        "Phone number cannot be empty"
      );
    }

    let backupPhone: string | null = null;

    if (
      data.backupPhone !== undefined &&
      data.backupPhone !== null
    ) {
      if (
        typeof data.backupPhone !== "string"
      ) {
        throw new Error(
          "Backup phone must be a string"
        );
      }

      const trimmedBackupPhone =
        data.backupPhone.trim();

      if (trimmedBackupPhone) {
        backupPhone = trimmedBackupPhone;
      }
    }

    if (
      !data.shippingAddress ||
      typeof data.shippingAddress !== "string"
    ) {
      throw new Error(
        "Shipping address is required"
      );
    }

    const shippingAddress =
      data.shippingAddress.trim();

    if (!shippingAddress) {
      throw new Error(
        "Shipping address cannot be empty"
      );
    }

    // =========================
    // ITEMS VALIDATION
    // =========================

    if (
      !data.items ||
      !Array.isArray(data.items)
    ) {
      throw new Error(
        "Order items are required"
      );
    }

    if (data.items.length === 0) {
      throw new Error(
        "Order must contain at least one item"
      );
    }

    // =========================
    // USER EXISTS
    // =========================

    const user = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // =========================
    // PRODUCT IDS
    // =========================

    const productIds = data.items.map(
      (item: any) => item.productId
    );

    const uniqueProductIds = [
      ...new Set(productIds),
    ];

    if (
      uniqueProductIds.length !==
      productIds.length
    ) {
      throw new Error(
        "Duplicate products are not allowed in an order"
      );
    }

    // =========================
    // PRODUCTS
    // =========================

    const products =
      await prisma.product.findMany({
        where: {
          id: {
            in: uniqueProductIds as number[],
          },
          isActive: true,
        },
      });

    if (
      products.length !==
      uniqueProductIds.length
    ) {
      throw new Error(
        "One or more products not found or inactive"
      );
    }

    // =========================
    // ORDER ITEMS
    // =========================

    const orderItems: any[] = [];

    for (const item of data.items) {
      if (
        !Number.isInteger(item.productId) ||
        item.productId <= 0
      ) {
        throw new Error(
          "Invalid product ID"
        );
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
        throw new Error(
          "Product not found"
        );
      }

      if (
        product.stockQuantity <
        item.quantity
      ) {
        throw new Error(
          `Insufficient stock for product: ${product.name}`
        );
      }

      const unitPrice =
        Number(product.price);

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

    // =========================
    // TOTAL
    // =========================

    const total =
      orderItems.reduce(
        (sum, item) =>
          sum + item.subtotal,
        0
      );

    // =========================
    // ORDER NUMBER
    // =========================

    const orderNumber =
      `ORD-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

    // =========================
    // CREATE ORDER
    // =========================

    return this.orderRepository.create(
      data.userId,
      orderNumber,
      orderItems,
      total,
      customerEmail,
      phoneNumber,
      backupPhone,
      shippingAddress
    );
  }

  // =========================
  // GET MY ORDERS
  // =========================

  async getOrdersByUser(
    userId: number
  ) {
    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      throw new Error(
        "Invalid user ID"
      );
    }

    return this.orderRepository.findByUserId(
      userId
    );
  }

  // =========================
  // GET ORDER BY ID
  // =========================

  async getOrderById(
    id: number,
    userId?: number
  ) {
    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      throw new Error(
        "Invalid order ID"
      );
    }

    const order =
      await this.orderRepository.findById(
        id
      );

    if (!order) {
      throw new Error(
        "Order not found"
      );
    }

    if (
      userId !== undefined &&
      order.userId !== userId
    ) {
      throw new Error(
        "Order not found"
      );
    }

    return order;
  }

  // =========================
  // GET ALL ORDERS
  // =========================

  async getOrders() {
    return this.orderRepository.findMany();
  }

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  async updateOrderStatus(
    id: number,
    status: string,
    adminId: number
  ) {
    // =========================
    // ID VALIDATION
    // =========================

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      throw new Error(
        "Invalid order ID"
      );
    }

    // =========================
    // STATUS VALIDATION
    // =========================

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (
      !validStatuses.includes(status)
    ) {
      throw new Error(
        "Invalid order status"
      );
    }

    // =========================
    // ADMIN VALIDATION
    // =========================

    if (
      !Number.isInteger(adminId) ||
      adminId <= 0
    ) {
      throw new Error(
        "Invalid admin ID"
      );
    }

    // =========================
    // GET ORDER
    // =========================

    const order =
      await this.orderRepository.findById(
        id
      );

    if (!order) {
      throw new Error(
        "Order not found"
      );
    }

    // =========================
    // PREVENT SAME STATUS
    // =========================

    if (order.status === status) {
      throw new Error(
        `Order is already ${status}`
      );
    }

    // =========================
    // ORDER STATUS TRANSITIONS
    // =========================

    const allowedTransitions: Record<
      string,
      string[]
    > = {
      PENDING: [
        "CONFIRMED",
        "CANCELLED",
      ],

      CONFIRMED: [
        "PROCESSING",
        "CANCELLED",
      ],

      PROCESSING: [
        "SHIPPED",
      ],

      SHIPPED: [
        "DELIVERED",
      ],

      DELIVERED: [],

      CANCELLED: [],
    };

    const allowedNextStatuses =
      allowedTransitions[
        order.status
      ];

    if (
      !allowedNextStatuses.includes(
        status
      )
    ) {
      throw new Error(
        `Invalid order status transition from ${order.status} to ${status}`
      );
    }

    // =========================
    // UPDATE STATUS
    // =========================

    return this.orderRepository.updateStatus(
      id,
      status,
      adminId
    );
  }

  // =========================
  // EMAIL VALIDATION
  // =========================

  private isValidEmail(
    email: string
  ) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  }
}