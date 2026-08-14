export class ProductSpecificationResponse {
  static fromSpecification(
    specification: any
  ) {
    return {
      id: specification.id,
      productId: specification.productId,
      name: specification.name,
      value: specification.value,

      product: specification.product
        ? {
            id: specification.product.id,
            name: specification.product.name,
          }
        : null,
    };
  }

  static fromSpecifications(
    specifications: any[]
  ) {
    return specifications.map(
      (specification) =>
        ProductSpecificationResponse.fromSpecification(
          specification
        )
    );
  }
}