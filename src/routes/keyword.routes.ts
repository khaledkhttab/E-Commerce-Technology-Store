import { Router } from "express";
import { KeywordController } from "../controllers/keyword.controller.js";

const router = Router();

const controller = new KeywordController();

router.post("/", controller.create);

router.get("/", controller.getAll);

router.get("/:id", controller.getById);

router.patch("/:id", controller.update);

router.delete("/:id", controller.delete);

export default router;