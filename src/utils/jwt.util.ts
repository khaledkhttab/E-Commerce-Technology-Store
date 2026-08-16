import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: number;
  email: string;
  role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
}

const JWT_SECRET: string =
  process.env.JWT_SECRET || "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export function generateToken(
  payload: JwtPayload
): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(
  token: string
): JwtPayload {
  const decoded = jwt.verify(
    token,
    JWT_SECRET
  );

  if (
    typeof decoded !== "object" ||
    decoded === null
  ) {
    throw new Error("Invalid JWT payload");
  }

  if (
    typeof decoded.userId !== "number" ||
    typeof decoded.email !== "string" ||
    !["CUSTOMER", "ADMIN", "SUPER_ADMIN"].includes(
      decoded.role
    )
  ) {
    throw new Error("Invalid JWT payload");
  }

  return {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role as
      | "CUSTOMER"
      | "ADMIN"
      | "SUPER_ADMIN",
  };
}