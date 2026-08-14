import { Router } from "express";
import { ProductSpecificationController } from "../controllers/product-specification.controller.js";

const router = Router();

const specificationController =
  new ProductSpecificationController();

router.post(
  "/",
  specificationController.createSpecification
);

router.get(
  "/",
  specificationController.getSpecifications
);

router.get(
  "/product/:productId",
  specificationController.getSpecificationsByProductId
);

router.get(
  "/:id",
  specificationController.getSpecificationById
);

router.patch(
  "/:id",
  specificationController.updateSpecification
);

router.delete(
  "/:id",
  specificationController.deleteSpecification
);

export default router;