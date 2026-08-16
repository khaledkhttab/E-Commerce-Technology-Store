import { UserRepository } from "../repositories/user.repository.js";
import {
  comparePassword,
  hashPassword,
} from "../utils/password.util.js";
import { generateToken } from "../utils/jwt.util.js";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: any) {
    if (
      !data.name ||
      typeof data.name !== "string"
    ) {
      throw new Error("User name is required");
    }

    const name = data.name.trim();

    if (!name) {
      throw new Error(
        "User name cannot be empty"
      );
    }

    if (
      !data.email ||
      typeof data.email !== "string"
    ) {
      throw new Error("User email is required");
    }

    const email =
      data.email.trim().toLowerCase();

    if (!this.isValidEmail(email)) {
      throw new Error(
        "Invalid email format"
      );
    }

    if (
      !data.password ||
      typeof data.password !== "string"
    ) {
      throw new Error(
        "User password is required"
      );
    }

    if (data.password.length < 8) {
      throw new Error(
        "Password must be at least 8 characters"
      );
    }

    const existingUser =
      await this.userRepository.findByEmail(
        email
      );

    if (existingUser) {
      throw new Error(
        "User with this email already exists"
      );
    }

    const hashedPassword =
      await hashPassword(data.password);

    const user =
      await this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        role: "CUSTOMER",
      });

    return user;
  }

  async login(data: any) {
    if (
      !data.email ||
      typeof data.email !== "string"
    ) {
      throw new Error("Email is required");
    }

    if (
      !data.password ||
      typeof data.password !== "string"
    ) {
      throw new Error("Password is required");
    }

    const email =
      data.email.trim().toLowerCase();

    const user =
      await this.userRepository.findByEmail(
        email
      );

    if (!user) {
      throw new Error(
        "Invalid email or password"
      );
    }

    const passwordMatches =
      await comparePassword(
        data.password,
        user.password
      );

    if (!passwordMatches) {
      throw new Error(
        "Invalid email or password"
      );
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      token,
    };
  }

  private isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  }
}