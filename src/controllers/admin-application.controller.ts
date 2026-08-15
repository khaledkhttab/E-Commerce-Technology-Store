import type {
  Request,
  Response,
} from "express";

import {
  AdminApplicationService,
} from "../services/admin-application.service.js";

import {
  AdminApplicationResponse,
} from "../responses/admin-application.response.js";

export class AdminApplicationController {
  private adminApplicationService:
    AdminApplicationService;

  constructor() {
    this.adminApplicationService =
      new AdminApplicationService();
  }

  createApplication = async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId = Number(req.body.userId);

      const application =
        await this.adminApplicationService.createApplication(
          userId
        );

      return res.status(201).json({
        success: true,
        message:
          "Admin application submitted successfully",
        data:
          AdminApplicationResponse.fromApplication(
            application
          ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getApplicationById = async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);

      const application =
        await this.adminApplicationService.getApplicationById(
          id
        );

      return res.status(200).json({
        success: true,
        data:
          AdminApplicationResponse.fromApplication(
            application
          ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getMyApplications = async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId = Number(req.params.userId);

      const applications =
        await this.adminApplicationService.getMyApplications(
          userId
        );

      return res.status(200).json({
        success: true,
        data:
          AdminApplicationResponse.fromApplications(
            applications
          ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getPendingApplications = async (
    req: Request,
    res: Response
  ) => {
    try {
      const applications =
        await this.adminApplicationService.getPendingApplications();

      return res.status(200).json({
        success: true,
        data:
          AdminApplicationResponse.fromApplications(
            applications
          ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getApplications = async (
    req: Request,
    res: Response
  ) => {
    try {
      const applications =
        await this.adminApplicationService.getApplications();

      return res.status(200).json({
        success: true,
        data:
          AdminApplicationResponse.fromApplications(
            applications
          ),
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  reviewApplication = async (
    req: Request,
    res: Response
  ) => {
    try {
      const applicationId =
        Number(req.params.id);

      const {
        reviewerId,
        status,
        rejectionReason,
      } = req.body;

      const application =
        await this.adminApplicationService.reviewApplication(
          applicationId,
          Number(reviewerId),
          status,
          rejectionReason
        );

      return res.status(200).json({
        success: true,
        message:
          `Admin application ${status.toLowerCase()} successfully`,
        data:
          AdminApplicationResponse.fromApplication(
            application
          ),
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
        "Admin application not found" ||
      message === "User not found"
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (
      message.includes("already have") ||
      message.includes("already an approved") ||
      message.includes("Only pending")
    ) {
      return res.status(409).json({
        success: false,
        message,
      });
    }

    if (
      message.includes("Only customers") ||
      message.includes("Only super admin") ||
      message.includes("Invalid") ||
      message.includes("required")
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