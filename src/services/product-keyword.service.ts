import { ProductKeywordRepository } from "../repositories/product-keyword.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { KeywordRepository } from "../repositories/keyword.repository.js";

export class ProductKeywordService {
  private productKeywordRepository: ProductKeywordRepository;
  private productRepository: ProductRepository;
  private keywordRepository: KeywordRepository;

  constructor() {
    this.productKeywordRepository = new ProductKeywordRepository();
    this.productRepository = new ProductRepository();
    this.keywordRepository = new KeywordRepository();
  }

  async createProductKeyword(productId: number, keywordId: number) {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    if (!keywordId) {
      throw new Error("Keyword ID is required");
    }

    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.isActive) {
      throw new Error("Product is inactive");
    }

    const keyword = await this.keywordRepository.findById(keywordId);

    if (!keyword) {
      throw new Error("Keyword not found");
    }

    const existing =
      await this.productKeywordRepository.findByIds(
        productId,
        keywordId
      );

    if (existing) {
      throw new Error("Product keyword relationship already exists");
    }

    return this.productKeywordRepository.create(
      productId,
      keywordId
    );
  }

  async getProductKeywords() {
    return this.productKeywordRepository.findAll();
  }

  async getKeywordsByProduct(productId: number) {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    return this.productKeywordRepository.findByProductId(productId);
  }

  async getProductsByKeyword(keywordId: number) {
    if (!keywordId) {
      throw new Error("Keyword ID is required");
    }

    const keyword = await this.keywordRepository.findById(keywordId);

    if (!keyword) {
      throw new Error("Keyword not found");
    }

    return this.productKeywordRepository.findByKeywordId(keywordId);
  }

  async deleteProductKeyword(
    productId: number,
    keywordId: number
  ) {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    if (!keywordId) {
      throw new Error("Keyword ID is required");
    }

    const relationship =
      await this.productKeywordRepository.findByIds(
        productId,
        keywordId
      );

    if (!relationship) {
      throw new Error("Product keyword relationship not found");
    }

    return this.productKeywordRepository.delete(
      productId,
      keywordId
    );
  }
}