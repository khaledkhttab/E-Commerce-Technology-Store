export class ProductResponse {
  static fromProduct(product: any) {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stockQuantity: product.stockQuantity,
      image: product.image,
      brandId: product.brandId,
      brand: product.brand
        ? {
            id: product.brand.id,
            name: product.brand.name,
          }
        : null,
      categories: product.categories
        ? product.categories.map((item: any) => ({
            id: item.category.id,
            name: item.category.name,
            type: item.category.type,
          }))
        : [],
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  static fromProducts(products: any[]) {
    return products.map((product: any) =>
      ProductResponse.fromProduct(product)
    );
  }
}