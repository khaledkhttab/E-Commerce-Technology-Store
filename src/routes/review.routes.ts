import { Router } from "express";
import { ReviewController } from "../controllers/review.controller.js";

const router = Router();

const reviewController =
  new ReviewController();

router.post(
  "/",
  reviewController.createReview
);

router.get(
  "/",
  reviewController.getReviews
);

router.get(
  "/:id",
  reviewController.getReviewById
);

router.patch(
  "/:id",
  reviewController.updateReview
);

router.delete(
  "/:id",
  reviewController.deleteReview
);

export default router;
