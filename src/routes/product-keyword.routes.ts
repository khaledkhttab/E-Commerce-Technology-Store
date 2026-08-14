import { Router } from "express";
import { ProductKeywordController } from "../controllers/product-keyword.controller.js";

const router = Router();

const controller = new ProductKeywordController();

router.post("/", controller.create);

router.get("/", controller.getAll);

router.get(
  "/product/:productId",
  controller.getByProduct
);

router.get(
  "/keyword/:keywordId",
  controller.getByKeyword
);

router.delete(
  "/:productId/:keywordId",
  controller.delete
);

export default router;