import { Router } from "express";
import {
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware.js";

import { UserController } from "../controllers/user.controller.js";

const router = Router();

const userController =
  new UserController();

router.post(
  "/",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  userController.createUser
);

router.get(
  "/",
  requireAuth,
  requireRole(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  userController.getUsers
);

router.get(
  "/admins",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  userController.getAdmins
);

router.patch(
  "/:id/demote",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  userController.demoteAdmin
);

router.get(
  "/:id",
  requireAuth,
  userController.getUserById
);

router.patch(
  "/:id",
  requireAuth,
  userController.updateUser
);

export default router;