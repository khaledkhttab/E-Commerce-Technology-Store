import {
  AdminApplicationRepository,
} from "../repositories/admin-application.repository.js";

export class AdminApplicationService {
  private adminApplicationRepository:
    AdminApplicationRepository;

  constructor() {
    this.adminApplicationRepository =
      new AdminApplicationRepository();
  }

  async createApplication(userId: number) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user ID");
    }

    const user = await this.getUser(userId);

    if (user.role !== "CUSTOMER") {
      throw new Error(
        "Only customers can apply to become an admin"
      );
    }

    const existingApplications =
      await this.adminApplicationRepository.findByUserId(
        userId
      );

    const pendingApplication =
      existingApplications.find(
        (application) =>
          application.status === "PENDING"
      );

    if (pendingApplication) {
      throw new Error(
        "You already have a pending admin application"
      );
    }

    const approvedApplication =
      existingApplications.find(
        (application) =>
          application.status === "APPROVED"
      );

    if (approvedApplication) {
      throw new Error(
        "You are already an approved admin"
      );
    }

    return this.adminApplicationRepository.create(
      userId
    );
  }

  async getApplicationById(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        "Invalid admin application ID"
      );
    }

    const application =
      await this.adminApplicationRepository.findById(
        id
      );

    if (!application) {
      throw new Error(
        "Admin application not found"
      );
    }

    return application;
  }

  async getMyApplications(userId: number) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user ID");
    }

    await this.getUser(userId);

    return this.adminApplicationRepository.findByUserId(
      userId
    );
  }

  async getPendingApplications() {
    return this.adminApplicationRepository.findPending();
  }

  async getApplications() {
    return this.adminApplicationRepository.findMany();
  }

  async reviewApplication(
    applicationId: number,
    reviewerId: number,
    status: "APPROVED" | "REJECTED",
    rejectionReason?: string
  ) {
    if (
      !Number.isInteger(applicationId) ||
      applicationId <= 0
    ) {
      throw new Error(
        "Invalid admin application ID"
      );
    }

    if (
      !Number.isInteger(reviewerId) ||
      reviewerId <= 0
    ) {
      throw new Error("Invalid reviewer ID");
    }

    if (
      status !== "APPROVED" &&
      status !== "REJECTED"
    ) {
      throw new Error(
        "Invalid application status"
      );
    }

    const reviewer = await this.getUser(reviewerId);

    if (reviewer.role !== "SUPER_ADMIN") {
      throw new Error(
        "Only super admin can review admin applications"
      );
    }

    const application =
      await this.adminApplicationRepository.findById(
        applicationId
      );

    if (!application) {
      throw new Error(
        "Admin application not found"
      );
    }

    if (application.status !== "PENDING") {
      throw new Error(
        "Only pending applications can be reviewed"
      );
    }

    if (
      status === "REJECTED" &&
      (!rejectionReason ||
        !rejectionReason.trim())
    ) {
      throw new Error(
        "Rejection reason is required"
      );
    }

    const result =
      await this.adminApplicationRepository.updateStatus(
        applicationId,
        status,
        reviewerId,
        status === "REJECTED"
          ? rejectionReason!.trim()
          : null
      );

    if (status === "APPROVED") {
      await this.promoteUserToAdmin(
        application.userId
      );
    }

    return result;
  }

  private async getUser(userId: number) {
    const user = await import("../config/prisma.js").then(
      ({ default: prisma }) =>
        prisma.user.findUnique({
          where: {
            id: userId,
          },
        })
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  private async promoteUserToAdmin(userId: number) {
    const prisma =
      await import("../config/prisma.js").then(
        ({ default: prisma }) => prisma
      );

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: "ADMIN",
      },
    });
  }
}