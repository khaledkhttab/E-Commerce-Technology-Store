import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";

export async function testAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Number(req.headers["x-user-id"]);

    if (!userId || Number.isNaN(userId)) {
      return res.status(401).json({
        success: false,
        message: "x-user-id header is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "CUSTOMER") {
      return res.status(403).json({
        success: false,
        message: "Only customers can access cart",
      });
    }

    (req as any).user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
}