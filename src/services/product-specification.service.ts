import prisma from "../config/prisma.js";
import { ProductSpecificationRepository } from "../repositories/product-specification.repository.js";

export class ProductSpecificationService {
  private specificationRepository: ProductSpecificationRepository;

  constructor() {
    this.specificationRepository =
      new ProductSpecificationRepository();
  }

  async createSpecification(data: any) {
    if (!data.productId) {
      throw new Error("Product ID is required");
    }

    if (
      !data.name ||
      typeof data.name !== "string" ||
      data.name.trim().length === 0
    ) {
      throw new Error(
        "Specification name is required"
      );
    }

    if (
      !data.value ||
      typeof data.value !== "string" ||
      data.value.trim().length === 0
    ) {
      throw new Error(
        "Specification value is required"
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

    return this.specificationRepository.create(
      data
    );
  }

  async getSpecifications() {
    return this.specificationRepository.findMany();
  }

  async getSpecificationById(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        "Invalid specification ID"
      );
    }

    const specification =
      await this.specificationRepository.findById(
        id
      );

    if (!specification) {
      throw new Error(
        "Product specification not found"
      );
    }

    return specification;
  }

  async getSpecificationsByProductId(
    productId: number
  ) {
    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      throw new Error("Invalid product ID");
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!product) {
      throw new Error("Product not found");
    }

    return this.specificationRepository.findByProductId(
      productId
    );
  }

  async updateSpecification(
    id: number,
    data: any
  ) {
    const specification =
      await this.specificationRepository.findById(
        id
      );

    if (!specification) {
      throw new Error(
        "Product specification not found"
      );
    }

    const updateData: any = {};

    if (data.name !== undefined) {
      if (
        typeof data.name !== "string" ||
        data.name.trim().length === 0
      ) {
        throw new Error(
          "Specification name cannot be empty"
        );
      }

      updateData.name = data.name;
    }

    if (data.value !== undefined) {
      if (
        typeof data.value !== "string" ||
        data.value.trim().length === 0
      ) {
        throw new Error(
          "Specification value cannot be empty"
        );
      }

      updateData.value = data.value;
    }

    return this.specificationRepository.update(
      id,
      updateData
    );
  }

  async deleteSpecification(id: number) {
    const specification =
      await this.specificationRepository.findById(
        id
      );

    if (!specification) {
      throw new Error(
        "Product specification not found"
      );
    }

    return this.specificationRepository.delete(id);
  }
}