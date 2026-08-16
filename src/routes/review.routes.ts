import { Router } from "express";
import { ReviewController } from "../controllers/review.controller.js";
import {
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware.js";

const router = Router();

const reviewController =
  new ReviewController();

// Authenticated customer creates a review
router.post(
  "/",
  requireAuth,
  reviewController.createReview
);

// Everyone authenticated can view reviews
router.get(
  "/",
  requireAuth,
  reviewController.getReviews
);

// Authenticated user can view a specific review
router.get(
  "/:id",
  requireAuth,
  reviewController.getReviewById
);

// User can update his own review
router.patch(
  "/:id",
  requireAuth,
  reviewController.updateReview
);

// User can delete his own review
router.delete(
  "/:id",
  requireAuth,
  reviewController.deleteReview
);

export default router;