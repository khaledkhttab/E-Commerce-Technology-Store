import { UserRepository } from "../repositories/user.repository.js";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(data: any) {
    if (!data.name || typeof data.name !== "string") {
      throw new Error("User name is required");
    }

    const name = data.name.trim();

    if (!name) {
      throw new Error("User name cannot be empty");
    }

    if (!data.email || typeof data.email !== "string") {
      throw new Error("User email is required");
    }

    const email = data.email.trim().toLowerCase();

    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (!data.password || typeof data.password !== "string") {
      throw new Error("User password is required");
    }

    if (!data.password.trim()) {
      throw new Error("User password cannot be empty");
    }

    if (!data.role) {
      throw new Error("User role is required");
    }

    const validRoles = [
      "CUSTOMER",
      "ADMIN",
      "SUPER_ADMIN",
    ];

    if (!validRoles.includes(data.role)) {
      throw new Error("Invalid user role");
    }

    const existingUser =
      await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error(
        "User with this email already exists"
      );
    }

    return this.userRepository.create({
      name,
      email,
      password: data.password,
      role: data.role,
    });
  }

  async getUserById(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid user ID");
    }

    const user =
      await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async getUsers() {
    return this.userRepository.findMany();
  }

  async updateUser(id: number, data: any) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid user ID");
    }

    const user =
      await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    if (
      data.name === undefined &&
      data.email === undefined &&
      data.role === undefined
    ) {
      throw new Error(
        "At least one field is required for update"
      );
    }

    const updateData: any = {};

    if (data.name !== undefined) {
      if (typeof data.name !== "string") {
        throw new Error("User name must be a string");
      }

      const name = data.name.trim();

      if (!name) {
        throw new Error("User name cannot be empty");
      }

      updateData.name = name;
    }

    if (data.email !== undefined) {
      if (typeof data.email !== "string") {
        throw new Error("User email must be a string");
      }

      const email = data.email.trim().toLowerCase();

      if (!this.isValidEmail(email)) {
        throw new Error("Invalid email format");
      }

      if (email !== user.email) {
        const existingUser =
          await this.userRepository.findByEmail(email);

        if (
          existingUser &&
          existingUser.id !== id
        ) {
          throw new Error(
            "User with this email already exists"
          );
        }
      }

      updateData.email = email;
    }

    if (data.role !== undefined) {
      const validRoles = [
        "CUSTOMER",
        "ADMIN",
        "SUPER_ADMIN",
      ];

      if (!validRoles.includes(data.role)) {
        throw new Error("Invalid user role");
      }

      updateData.role = data.role;
    }

    return this.userRepository.update(
      id,
      updateData
    );
  }

  private isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}