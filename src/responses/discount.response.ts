export class DiscountResponse {
  static fromDiscount(discount: any) {
    return {
      id: discount.id,
      value: Number(discount.value),
      startDate: discount.startDate,
      endDate: discount.endDate,
      productId: discount.productId,

      product: discount.product
        ? {
            id: discount.product.id,
            name: discount.product.name,
          }
        : null,
    };
  }

  static fromDiscounts(
    discounts: any[]
  ) {
    return discounts.map((discount) =>
      DiscountResponse.fromDiscount(discount)
    );
  }
}