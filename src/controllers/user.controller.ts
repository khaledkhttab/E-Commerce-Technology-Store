import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { UserResponse } from "../responses/user.response.js";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = async (
    req: Request,
    res: Response
  ) => {
    try {
      const user =
        await this.userService.createUser(req.body);

      return res.status(201).json({
        success: true,
        data: UserResponse.fromUser(user),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getUserById = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const user =
        await this.userService.getUserById(id);

      return res.status(200).json({
        success: true,
        data: UserResponse.fromUser(user),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getUsers = async (
    req: Request,
    res: Response
  ) => {
    try {
      const users =
        await this.userService.getUsers();

      return res.status(200).json({
        success: true,
        data: UserResponse.fromUsers(users),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getAdmins = async (
    req: Request,
    res: Response
  ) => {
    try {
      const users =
        await this.userService.getAdmins();

      return res.status(200).json({
        success: true,
        data: UserResponse.fromUsers(users),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  updateUser = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const user =
        await this.userService.updateUser(
          id,
          req.body
        );

      return res.status(200).json({
        success: true,
        data: UserResponse.fromUser(user),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  demoteAdmin = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);
      const requesterId = Number(
        req.body.requesterId
      );

      const user =
        await this.userService.demoteAdmin(
          id,
          requesterId
        );

      return res.status(200).json({
        success: true,
        message:
          "Admin demoted to customer successfully",
        data: UserResponse.fromUser(user),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  private handleError(
    res: Response,
    error: any
  ) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    if (
      message === "User not found" ||
      message === "Requester not found"
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (
      message ===
      "User with this email already exists"
    ) {
      return res.status(409).json({
        success: false,
        message,
      });
    }

    if (
      message ===
        "Only super admin can demote admins" ||
      message ===
        "Super admin cannot demote themselves" ||
      message === "User is not an admin"
    ) {
      return res.status(403).json({
        success: false,
        message,
      });
    }

    if (
      message.startsWith("Invalid") ||
      message.includes("required") ||
      message.includes("cannot be empty") ||
      message.includes("must be a string")
    ) {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
}