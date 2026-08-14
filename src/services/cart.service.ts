import { CartRepository } from "../repositories/cart.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";

export class CartService {
  private cartRepository: CartRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

async getCart(userId: number) {
  let cart = await this.cartRepository.getCartByUserId(userId);

  if (!cart) {
    await this.cartRepository.createCart(userId);

    cart = await this.cartRepository.getCartByUserId(userId);
  }

  if (!cart) {
    throw new Error("Failed to create cart");
  }

  return cart;
}

  async addProductToCart(
    userId: number,
    productId: number,
    quantity: number
  ) {
    // 1. Validate quantity
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    // 2. Check product
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    // 3. Check active
    if (!product.isActive) {
      throw new Error("Product is not active");
    }

    // 4. Check stock
    if (product.stockQuantity <= 0) {
      throw new Error("Product is out of stock");
    }

    // 5. Get/Create cart
let cart = await this.cartRepository.getCartByUserId(userId);

if (!cart) {
  await this.cartRepository.createCart(userId);

  cart = await this.cartRepository.getCartByUserId(userId);
}

if (!cart) {
  throw new Error("Failed to create cart");
}

// 6. Check existing item
const existingItem =
  await this.cartRepository.findCartItem(
    cart.id,
    productId
  );

// 7. Make sure total quantity doesn't exceed stock
const newQuantity =
  (existingItem?.quantity ?? 0) + quantity;

if (newQuantity > product.stockQuantity) {
  throw new Error("Requested quantity exceeds available stock");
}

// 8. Add to cart
return this.cartRepository.addItem(
  cart.id,
  productId,
  quantity
);
  }
  async updateCartItem(
    userId: number,
    productId: number,
    quantity: number
  ) {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.isActive) {
      throw new Error("Product is not active");
    }

    if (product.stockQuantity <= 0) {
      throw new Error("Product is out of stock");
    }

    if (quantity > product.stockQuantity) {
      throw new Error("Requested quantity exceeds available stock");
    }

    const cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const item = await this.cartRepository.findCartItem(
      cart.id,
      productId
    );

    if (!item) {
      throw new Error("Product is not in the cart");
    }

    return this.cartRepository.updateItemQuantity(
      cart.id,
      productId,
      quantity
    );
  }

  async removeProductFromCart(
    userId: number,
    productId: number
  ) {
    const cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const item = await this.cartRepository.findCartItem(
      cart.id,
      productId
    );

    if (!item) {
      throw new Error("Product is not in the cart");
    }

    return this.cartRepository.removeItem(
      cart.id,
      productId
    );
  }

  async clearCart(userId: number) {
    const cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    return this.cartRepository.clearCart(cart.id);
  }
}