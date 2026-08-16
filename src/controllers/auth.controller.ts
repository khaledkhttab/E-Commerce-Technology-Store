import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { UserResponse } from "../responses/user.response.js";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (
    req: Request,
    res: Response
  ) => {
    try {
      const user =
        await this.authService.register(
          req.body
        );

      return res.status(201).json({
        success: true,
        data: UserResponse.fromUser(user),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  login = async (
    req: Request,
    res: Response
  ) => {
    try {
      const result =
        await this.authService.login(
          req.body
        );

      return res.status(200).json({
        success: true,
        data: {
          user: UserResponse.fromUser(
            result.user
          ),
          token: result.token,
        },
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
        "Invalid email or password"
    ) {
      return res.status(401).json({
        success: false,
        message,
      });
    }

    if (
      message.startsWith("User") ||
      message.startsWith("Invalid") ||
      message.startsWith("Password") ||
      message.includes("required") ||
      message.includes("cannot be empty")
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