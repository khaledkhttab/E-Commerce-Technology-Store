export class AdminApplicationResponse {
  static fromApplication(
    application: any
  ) {
    return {
      id: application.id,

      applicant: application.applicant
        ? {
            id: application.applicant.id,
            name: application.applicant.name,
            email: application.applicant.email,
            role: application.applicant.role,
          }
        : null,

      status: application.status,

      reviewer: application.reviewer
        ? {
            id: application.reviewer.id,
            name: application.reviewer.name,
            email: application.reviewer.email,
            role: application.reviewer.role,
          }
        : null,

      reviewedAt: application.reviewedAt,
      rejectionReason:
        application.rejectionReason,

      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    };
  }

  static fromApplications(
    applications: any[]
  ) {
    return applications.map(
      (application: any) =>
        this.fromApplication(application)
    );
  }
}