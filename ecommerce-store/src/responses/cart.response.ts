export class CartResponse {
  static fromCart(cart: any) {
    const items = cart.items.map((item: any) => {
      const unitPrice = Number(item.product.price);

      return {
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        image: item.product.image,
        brand: item.product.brand,
        quantity: item.quantity,
        unitPrice,
        subtotal: unitPrice * item.quantity,
      };
    });

    const totalItems = items.reduce(
      (total: number, item: any) =>
        total + item.quantity,
      0
    );

    const totalPrice = items.reduce(
      (total: number, item: any) =>
        total + item.subtotal,
      0
    );

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      totalItems,
      totalPrice,
    };
  }
}