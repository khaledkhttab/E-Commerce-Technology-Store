export class PaymentResponse {
  static fromPayment(payment: any) {
    return {
      id: payment.id,
      orderId: payment.orderId,
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.paymentStatus,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,

      order: payment.order
        ? {
            id: payment.order.id,
            orderNumber:
              payment.order.orderNumber,
            status: payment.order.status,
          }
        : null,

      proof: payment.proof
        ? {
            id: payment.proof.id,
            proofImageUrl:
              payment.proof.proofImageUrl,
            uploadedAt:
              payment.proof.uploadedAt,
          }
        : null,
    };
  }

  static fromPayments(
    payments: any[]
  ) {
    return payments.map((payment) =>
      PaymentResponse.fromPayment(payment)
    );
  }
}