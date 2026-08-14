import prisma from "../config/prisma.js";
import { ReviewRepository } from "../repositories/review.repository.js";

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  async createReview(data: any) {
    if (!data.userId) {
      throw new Error("User ID is required");
    }

    if (!data.productId) {
      throw new Error("Product ID is required");
    }

    if (data.rating === undefined) {
      throw new Error("Rating is required");
    }

    if (
      !Number.isInteger(data.rating) ||
      data.rating < 1 ||
      data.rating > 5
    ) {
      throw new Error(
        "Rating must be an integer between 1 and 5"
      );
    }

    if (
      !data.comment ||
      typeof data.comment !== "string" ||
      data.comment.trim().length === 0
    ) {
      throw new Error("Comment is required");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const product = await prisma.product.findUnique({
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

    const existingReview =
      await this.reviewRepository.findByUserAndProduct(
        data.userId,
        data.productId
      );

    if (existingReview) {
      throw new Error(
        "User already reviewed this product"
      );
    }

    return this.reviewRepository.create(data);
  }

  async getReviews() {
    return this.reviewRepository.findMany();
  }

  async getReviewById(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid review ID");
    }

    const review =
      await this.reviewRepository.findById(id);

    if (!review) {
      throw new Error("Review not found");
    }

    return review;
  }

  async updateReview(id: number, data: any) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid review ID");
    }

    const review =
      await this.reviewRepository.findById(id);

    if (!review) {
      throw new Error("Review not found");
    }

    if (data.rating !== undefined) {
      if (
        !Number.isInteger(data.rating) ||
        data.rating < 1 ||
        data.rating > 5
      ) {
        throw new Error(
          "Rating must be an integer between 1 and 5"
        );
      }
    }

    if (data.comment !== undefined) {
      if (
        typeof data.comment !== "string" ||
        data.comment.trim().length === 0
      ) {
        throw new Error("Comment cannot be empty");
      }
    }

    return this.reviewRepository.update(
      id,
      data
    );
  }

  async deleteReview(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid review ID");
    }

    const review =
      await this.reviewRepository.findById(id);

    if (!review) {
      throw new Error("Review not found");
    }

    return this.reviewRepository.delete(id);
  }
}
