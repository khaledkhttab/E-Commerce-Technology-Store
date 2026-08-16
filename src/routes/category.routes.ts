import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import {
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware.js";

const router = Router();

const categoryController =
  new CategoryController();

// Public
router.get(
  "/",
  categoryController.getCategories
);

router.get(
  "/:id",
  categoryController.getCategoryById
);

// Admin
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  categoryController.createCategory
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  categoryController.deleteCategory
);

export default router;