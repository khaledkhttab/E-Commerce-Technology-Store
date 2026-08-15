import { Router } from "express";

import {
  AdminApplicationController,
} from "../controllers/admin-application.controller.js";

const router = Router();

const controller =
  new AdminApplicationController();

// Submit application
router.post(
  "/",
  controller.createApplication
);

// Get all applications
router.get(
  "/",
  controller.getApplications
);

// Get pending applications
router.get(
  "/pending",
  controller.getPendingApplications
);

// Get applications for specific user
router.get(
  "/user/:userId",
  controller.getMyApplications
);

// Get application by ID
router.get(
  "/:id",
  controller.getApplicationById
);

// Approve / Reject application
router.patch(
  "/:id/review",
  controller.reviewApplication
);

export default router;