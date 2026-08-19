import { ProductRepository } from "../repositories/product.repository.js";
import { BrandRepository } from "../repositories/brand.repository.js";
import { CategoryRepository } from "../repositories/category.repository.js";

export class ProductService {
  private productRepository: ProductRepository;
  private brandRepository: BrandRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.brandRepository = new BrandRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async createProduct(data: any) {

    if (
  !data.name ||
  typeof data.name !== "string" ||
  !data.name.trim()
) {
  throw new Error("Product name is required");
}

    if (data.price <= 0) {
      throw new Error("Product price must be greater than 0");
    }

    if (data.stockQuantity < 0) {
      throw new Error("Stock quantity cannot be negative");
    }

    const brand = await this.brandRepository.findById(data.brandId);

    if (!brand) {
      throw new Error("Brand not found");
    }

    if (!data.categoryIds || data.categoryIds.length === 0) {
      throw new Error("At least one category is required");
    }

    const categories = await this.categoryRepository.findByIds(
      data.categoryIds
    );

    if (categories.length !== data.categoryIds.length) {
      throw new Error("One or more categories not found");
    }

    return this.productRepository.create(data);
  }

  async getProductById(id: number) {
     if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid product ID");
  }
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async getProducts() {
    return this.productRepository.findMany();
  }

async updateProduct(id: number, data: any) {
  const product = await this.productRepository.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  // Validate price if provided
  if (data.price !== undefined && data.price <= 0) {
    throw new Error("Product price must be greater than 0");
  }

  // Validate stock if provided
  if (data.stockQuantity !== undefined && data.stockQuantity < 0) {
    throw new Error("Stock quantity cannot be negative");
  }

  // Validate Brand if provided
  if (data.brandId !== undefined) {
    const brand = await this.brandRepository.findById(data.brandId);

    if (!brand) {
      throw new Error("Brand not found");
    }
  }

  // Validate Categories if provided
  if (data.categoryIds !== undefined) {
    if (data.categoryIds.length === 0) {
      throw new Error("At least one category is required");
    }

    const categories = await this.categoryRepository.findByIds(
      data.categoryIds
    );

    if (categories.length !== data.categoryIds.length) {
      throw new Error("One or more categories not found");
    }
  }

  return this.productRepository.update(id, data);
}

  async updateStock(id: number, stockQuantity: number) {
  const product = await this.productRepository.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  if (stockQuantity < 0) {
    throw new Error("Stock quantity cannot be negative");
  }

  return this.productRepository.updateStock(id, stockQuantity);
}

  async deactivateProduct(id: number) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return this.productRepository.deactivate(id);
  }
}