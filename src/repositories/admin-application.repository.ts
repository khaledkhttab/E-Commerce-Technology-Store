import prisma from "../config/prisma.js";

export class AdminApplicationRepository {
  async create(userId: number) {
    return prisma.adminApplication.create({
      data: {
        userId,
        status: "PENDING",
      },
      include: {
        applicant: true,
        reviewer: true,
      },
    });
  }

  async findById(id: number) {
    return prisma.adminApplication.findUnique({
      where: {
        id,
      },
      include: {
        applicant: true,
        reviewer: true,
      },
    });
  }

  async findByUserId(userId: number) {
    return prisma.adminApplication.findMany({
      where: {
        userId,
      },
      include: {
        applicant: true,
        reviewer: true,
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  async findPending() {
    return prisma.adminApplication.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        applicant: true,
        reviewer: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findMany() {
    return prisma.adminApplication.findMany({
      include: {
        applicant: true,
        reviewer: true,
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  async updateStatus(
    id: number,
    status: "APPROVED" | "REJECTED",
    reviewedBy: number,
    rejectionReason?: string | null
  ) {
    return prisma.adminApplication.update({
      where: {
        id,
      },
      data: {
        status,
        reviewedBy,
        reviewedAt: new Date(),
        rejectionReason:
          status === "REJECTED"
            ? rejectionReason
            : null,
      },
      include: {
        applicant: true,
        reviewer: true,
      },
    });
  }
}