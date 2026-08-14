import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();

const userController =
  new UserController();

router.post(
  "/",
  userController.createUser
);

router.get(
  "/",
  userController.getUsers
);

router.get(
  "/:id",
  userController.getUserById
);

router.patch(
  "/:id",
  userController.updateUser
);

export default router;