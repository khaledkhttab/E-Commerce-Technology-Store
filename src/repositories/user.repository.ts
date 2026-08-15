import prisma from "../config/prisma.js";

export class UserRepository {
  async create(data: any) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      },
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findMany() {
    return prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  async update(id: number, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

async findAdmins() {
  return prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "SUPER_ADMIN"],
      },
    },
    orderBy: {
      id: "asc",
    },
  });
}

async demoteAdmin(id: number) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      role: "CUSTOMER",
    },
  });
}
}

