import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";

const router = Router();

const categoryController =
  new CategoryController();

router.post(
  "/",
  categoryController.createCategory
);

router.get(
  "/",
  categoryController.getCategories
);

router.get(
  "/:id",
  categoryController.getCategoryById
);

router.patch(
  "/:id",
  categoryController.updateCategory
);

router.delete(
  "/:id",
  categoryController.deleteCategory
);

export default router;