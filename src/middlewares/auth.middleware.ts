import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { verifyToken } from "../utils/jwt.util.js";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role:
      | "CUSTOMER"
      | "ADMIN"
      | "SUPER_ADMIN";
  };
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "Authorization header is required",
      });
    }

    if (
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authorization format",
      });
    }

    const token =
      authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is required",
      });
    }

    const payload =
      verifyToken(token);

    (req as AuthRequest).user = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
}

export function requireRole(
  ...allowedRoles: Array<
    "CUSTOMER" | "ADMIN" | "SUPER_ADMIN"
  >
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authReq =
      req as AuthRequest;

    if (!authReq.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated",
      });
    }

    if (
      !allowedRoles.includes(
        authReq.user.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
}