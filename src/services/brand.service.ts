import { BrandRepository } from "../repositories/brand.repository.js";

export class BrandService {
  private brandRepository: BrandRepository;

  constructor() {
    this.brandRepository = new BrandRepository();
  }

  async getBrands() {
    return this.brandRepository.findMany();
  }

  async getBrandById(id: number) {
    const brand = await this.brandRepository.findById(id);

    if (!brand) {
      throw new Error("Brand not found");
    }

    return brand;
  }

  async createBrand(name: string) {
    if (!name || name.trim() === "") {
      throw new Error("Brand name is required");
    }

    return this.brandRepository.create(name.trim());
  }

  async updateBrand(id: number, name: string) {
    const brand = await this.brandRepository.findById(id);

    if (!brand) {
      throw new Error("Brand not found");
    }

    if (!name || name.trim() === "") {
      throw new Error("Brand name is required");
    }

    return this.brandRepository.update(id, name.trim());
  }

  async deleteBrand(id: number) {
    const brand = await this.brandRepository.findById(id);

    if (!brand) {
      throw new Error("Brand not found");
    }

    return this.brandRepository.delete(id);
  }
}