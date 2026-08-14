import { CategoryType } from "../generated/prisma/index.js";
import { CategoryRepository } from "../repositories/category.repository.js";

const VALID_CATEGORY_TYPES = Object.values(CategoryType);

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(data: {
    name: string;
    type: string;
  }) {
    const name = this.validateName(data.name);
    const type = this.validateType(data.type);

    const existingCategory =
      await this.categoryRepository.findByName(name);

    if (existingCategory) {
      throw new Error("Category with this name already exists");
    }

    return this.categoryRepository.create({
      name,
      type,
    });
  }

  async getCategoryById(id: number) {
    this.validateId(id);

    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  async getCategories(type?: string) {
    let categoryType: CategoryType | undefined;

    if (type !== undefined) {
      categoryType = this.validateType(type);
    }

    return this.categoryRepository.findMany(categoryType);
  }

  async updateCategory(
    id: number,
    data: {
      name?: string;
      type?: string;
    }
  ) {
    this.validateId(id);

    const existingCategory =
      await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new Error("Category not found");
    }

    if (data.name === undefined && data.type === undefined) {
      throw new Error(
        "At least one field is required for update"
      );
    }

    const updateData: {
      name?: string;
      type?: CategoryType;
    } = {};

    if (data.name !== undefined) {
      const name = this.validateName(data.name);

      if (name !== existingCategory.name) {
        const duplicate =
          await this.categoryRepository.findByName(name);

        if (duplicate && duplicate.id !== id) {
          throw new Error(
            "Category with this name already exists"
          );
        }
      }

      updateData.name = name;
    }

    if (data.type !== undefined) {
      updateData.type = this.validateType(data.type);
    }

    return this.categoryRepository.update(id, updateData);
  }

  async deleteCategory(id: number) {
    this.validateId(id);

    const existingCategory =
      await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new Error("Category not found");
    }

    const productCount =
      await this.categoryRepository.countProducts(id);

    if (productCount > 0) {
      throw new Error(
        "Cannot delete category because it is associated with products"
      );
    }

    await this.categoryRepository.delete(id);

    return {
      message: "Category deleted successfully",
    };
  }

  private validateId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid category ID");
    }
  }

  private validateName(name: string) {
    if (typeof name !== "string") {
      throw new Error("Category name must be a string");
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new Error("Category name cannot be empty");
    }

    return trimmedName;
  }

  private validateType(type: string): CategoryType {
    if (
      typeof type !== "string" ||
      !VALID_CATEGORY_TYPES.includes(type as CategoryType)
    ) {
      throw new Error(
        `Invalid category type. Allowed values: ${VALID_CATEGORY_TYPES.join(
          ", "
        )}`
      );
    }

    return type as CategoryType;
  }
}