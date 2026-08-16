import type {
  Request,
  Response,
} from "express";

import { ReviewService } from "../services/review.service.js";
import { ReviewResponse } from "../responses/review.response.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

 createReview = async (
  req: Request,
  res: Response
) => {
  try {
    const authReq =
      req as AuthRequest;

    const review =
      await this.reviewService.createReview(
        req.body,
        authReq.user!.userId
      );

    return res.status(201).json({
      success: true,
      data: ReviewResponse.fromReview(review),
    });
  } catch (error: any) {
    return this.handleError(res, error);
  }
};

  getReviews = async (
    req: Request,
    res: Response
  ) => {
    try {
      const reviews =
        await this.reviewService.getReviews();

      return res.status(200).json({
        success: true,
        data: ReviewResponse.fromReviews(
          reviews
        ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getReviewById = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const review =
        await this.reviewService.getReviewById(id);

      return res.status(200).json({
        success: true,
        data: ReviewResponse.fromReview(review),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  updateReview = async (
  req: Request,
  res: Response
) => {
  try {
    const authReq =
      req as AuthRequest;

    const id = Number(req.params.id);

    const review =
      await this.reviewService.updateReview(
        id,
        req.body,
        authReq.user!.userId
      );

    return res.status(200).json({
      success: true,
      data: ReviewResponse.fromReview(review),
    });
  } catch (error: any) {
    return this.handleError(res, error);
  }
};

  deleteReview = async (
  req: Request,
  res: Response
) => {
  try {
    const authReq =
      req as AuthRequest;

    const id = Number(req.params.id);

    await this.reviewService.deleteReview(
      id,
      authReq.user!.userId
    );

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    return this.handleError(res, error);
  }
};

  private handleError(
    res: Response,
    error: any
  ) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    if (
      message === "User not found" ||
      message === "Product not found" ||
      message === "Review not found"
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (
      message ===
        "User already reviewed this product"
    ) {
      return res.status(409).json({
        success: false,
        message,
      });
    }

    if (
      message.includes("required") ||
      message.includes("Invalid") ||
      message.includes("inactive") ||
      message.includes("between") ||
      message.includes("empty")
    ) {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
}
