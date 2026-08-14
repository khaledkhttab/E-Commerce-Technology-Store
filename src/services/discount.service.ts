import prisma from "../config/prisma.js";
import { DiscountRepository } from "../repositories/discount.repository.js";

export class DiscountService {
  private discountRepository: DiscountRepository;

  constructor() {
    this.discountRepository =
      new DiscountRepository();
  }

  async createDiscount(data: any) {
    if (!data.productId) {
      throw new Error("Product ID is required");
    }

    if (data.value === undefined) {
      throw new Error("Discount value is required");
    }

    if (Number(data.value) <= 0) {
      throw new Error(
        "Discount value must be greater than 0"
      );
    }

    if (!data.startDate) {
      throw new Error("Start date is required");
    }

    if (!data.endDate) {
      throw new Error("End date is required");
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      throw new Error("Invalid discount dates");
    }

    if (endDate <= startDate) {
      throw new Error(
        "End date must be after start date"
      );
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id: data.productId,
        },
      });

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.isActive) {
      throw new Error("Product is inactive");
    }

    return this.discountRepository.create({
      value: data.value,
      startDate,
      endDate,
      productId: data.productId,
    });
  }

  async getDiscounts() {
    return this.discountRepository.findMany();
  }

  async getDiscountById(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid discount ID");
    }

    const discount =
      await this.discountRepository.findById(id);

    if (!discount) {
      throw new Error("Discount not found");
    }

    return discount;
  }

  async updateDiscount(
    id: number,
    data: any
  ) {
    const discount =
      await this.discountRepository.findById(id);

    if (!discount) {
      throw new Error("Discount not found");
    }

    const updateData: any = {};

    if (data.value !== undefined) {
      if (Number(data.value) <= 0) {
        throw new Error(
          "Discount value must be greater than 0"
        );
      }

      updateData.value = data.value;
    }

    let startDate =
      discount.startDate;

    let endDate =
      discount.endDate;

    if (data.startDate !== undefined) {
      startDate = new Date(data.startDate);

      if (Number.isNaN(startDate.getTime())) {
        throw new Error("Invalid start date");
      }

      updateData.startDate = startDate;
    }

    if (data.endDate !== undefined) {
      endDate = new Date(data.endDate);

      if (Number.isNaN(endDate.getTime())) {
        throw new Error("Invalid end date");
      }

      updateData.endDate = endDate;
    }

    if (endDate <= startDate) {
      throw new Error(
        "End date must be after start date"
      );
    }

    return this.discountRepository.update(
      id,
      updateData
    );
  }

  async deleteDiscount(id: number) {
    const discount =
      await this.discountRepository.findById(id);

    if (!discount) {
      throw new Error("Discount not found");
    }

    return this.discountRepository.delete(id);
  }
}