import prisma from "../config/prisma.js";
import { ReviewRepository } from "../repositories/review.repository.js";

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  async createReview(
    data: any,
    userId: number
  ) {
    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      throw new Error("Invalid user ID");
    }

    if (!data.productId) {
      throw new Error("Product ID is required");
    }

    if (
      !Number.isInteger(data.productId) ||
      data.productId <= 0
    ) {
      throw new Error("Invalid product ID");
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

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new Error("User not found");
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

    const existingReview =
      await this.reviewRepository.findByUserAndProduct(
        userId,
        data.productId
      );

    if (existingReview) {
      throw new Error(
        "User already reviewed this product"
      );
    }

    return this.reviewRepository.create({
      userId,
      productId: data.productId,
      rating: data.rating,
      comment: data.comment.trim(),
    });
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

  async updateReview(
    id: number,
    data: any,
    userId: number
  ) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid review ID");
    }

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      throw new Error("Invalid user ID");
    }

    const review =
      await this.reviewRepository.findById(id);

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.userId !== userId) {
      throw new Error(
        "You are not allowed to update this review"
      );
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
        throw new Error(
          "Comment cannot be empty"
        );
      }

      data.comment = data.comment.trim();
    }

    return this.reviewRepository.update(
      id,
      data
    );
  }

  async deleteReview(
    id: number,
    userId: number
  ) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid review ID");
    }

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      throw new Error("Invalid user ID");
    }

    const review =
      await this.reviewRepository.findById(id);

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.userId !== userId) {
      throw new Error(
        "You are not allowed to delete this review"
      );
    }

    return this.reviewRepository.delete(id);
  }
}