import { KeywordRepository } from "../repositories/keyword.repository.js";

export class KeywordService {
  private keywordRepository: KeywordRepository;

  constructor() {
    this.keywordRepository = new KeywordRepository();
  }

  async createKeyword(name: string) {
    if (!name || name.trim() === "") {
      throw new Error("Keyword name is required");
    }

    const existing = await this.keywordRepository.findMany();

    const duplicate = existing.find(
      (keyword) =>
        keyword.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicate) {
      throw new Error("Keyword already exists");
    }

    return this.keywordRepository.create(name.trim());
  }

  async getKeywordById(id: number) {
    if (!id) {
      throw new Error("Keyword ID is required");
    }

    const keyword = await this.keywordRepository.findById(id);

    if (!keyword) {
      throw new Error("Keyword not found");
    }

    return keyword;
  }

  async getKeywords() {
    return this.keywordRepository.findMany();
  }

  async updateKeyword(id: number, name: string) {
    if (!id) {
      throw new Error("Keyword ID is required");
    }

    if (!name || name.trim() === "") {
      throw new Error("Keyword name is required");
    }

    const keyword = await this.keywordRepository.findById(id);

    if (!keyword) {
      throw new Error("Keyword not found");
    }

    const existing = await this.keywordRepository.findMany();

    const duplicate = existing.find(
      (item) =>
        item.id !== id &&
        item.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicate) {
      throw new Error("Keyword already exists");
    }

    return this.keywordRepository.update(id, name.trim());
  }

  async deleteKeyword(id: number) {
    if (!id) {
      throw new Error("Keyword ID is required");
    }

    const keyword = await this.keywordRepository.findById(id);

    if (!keyword) {
      throw new Error("Keyword not found");
    }

    return this.keywordRepository.delete(id);
  }
}