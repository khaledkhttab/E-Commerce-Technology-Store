import prisma from "../config/prisma.js";
import { PaymentRepository } from "../repositories/payment.repository.js";

export class PaymentService {
  private paymentRepository: PaymentRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
  }

  async createPayment(data: any) {
    if (!data.orderId) {
      throw new Error("Order ID is required");
    }

    if (
      !Number.isInteger(data.orderId) ||
      data.orderId <= 0
    ) {
      throw new Error("Invalid order ID");
    }

    if (!data.paymentMethod) {
      throw new Error(
        "Payment method is required"
      );
    }

    const validMethods = [
      "CASH_ON_DELIVERY",
      "BANK_TRANSFER",
    ];

    if (
      !validMethods.includes(data.paymentMethod)
    ) {
      throw new Error("Invalid payment method");
    }

    const order = await prisma.order.findUnique({
      where: {
        id: data.orderId,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const existingPayment =
      await this.paymentRepository.findByOrderId(
        data.orderId
      );

    if (existingPayment) {
      throw new Error(
        "Payment already exists for this order"
      );
    }

    let paymentStatus = "PENDING";

    if (
      data.paymentMethod === "BANK_TRANSFER"
    ) {
      paymentStatus = "PENDING_VERIFICATION";
    }

    return this.paymentRepository.create(
      data.orderId,
      data.paymentMethod,
      paymentStatus
    );
  }

  async getPaymentById(id: number) {
    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      throw new Error("Invalid payment ID");
    }

    const payment =
      await this.paymentRepository.findById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }

  async getPayments() {
    return this.paymentRepository.findMany();
  }

  async updatePaymentStatus(
    id: number,
    paymentStatus: string
  ) {
    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      throw new Error("Invalid payment ID");
    }

    const validStatuses = [
      "PENDING",
      "PENDING_VERIFICATION",
      "VERIFIED",
      "REJECTED",
    ];

    if (
      !validStatuses.includes(paymentStatus)
    ) {
      throw new Error(
        "Invalid payment status"
      );
    }

    const payment =
      await this.paymentRepository.findById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (
      payment.paymentStatus === "VERIFIED" &&
      paymentStatus !== "VERIFIED"
    ) {
      throw new Error(
        "Verified payment cannot be changed"
      );
    }

    return this.paymentRepository.updateStatus(
      id,
      paymentStatus
    );
  }
}
