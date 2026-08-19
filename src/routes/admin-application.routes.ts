import { Router } from "express";

import {
  AdminApplicationController,
} from "../controllers/admin-application.controller.js";

import {
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware.js";

const router = Router();

const controller =
  new AdminApplicationController();

// Submit application
router.post(
  "/",
  requireAuth,
  requireRole("CUSTOMER"),
  controller.createApplication
);

// Get all applications
router.get(
  "/",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  controller.getApplications
);

// Get pending applications
router.get(
  "/pending",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  controller.getPendingApplications
);

// Get applications for specific user
router.get(
  "/user/:userId",
  requireAuth,
  requireRole("CUSTOMER"),
  controller.getMyApplications
);

// Get application by ID
router.get(
  "/:id",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  controller.getApplicationById
);

// Approve / Reject application
router.patch(
  "/:id/review",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  controller.reviewApplication
);

export default router;