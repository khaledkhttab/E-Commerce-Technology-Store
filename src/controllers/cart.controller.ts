import type { Request, Response } from "express";
import { CartService } from "../services/cart.service.js";
import { CartResponse } from "../responses/cart.response.js";

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  async getCart(req: Request, res: Response) {
    try {
      const userId = Number((req as any).user.userId);

      const cart = await this.cartService.getCart(userId);

      return res.status(200).json({
        success: true,
        data: CartResponse.fromCart(cart),
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addProductToCart(req: Request, res: Response) {
    try {
      const userId = Number((req as any).user.userId);
      const productId = Number(req.body.productId);
      const quantity = Number(req.body.quantity);

      const cartItem = await this.cartService.addProductToCart(
        userId,
        productId,
        quantity
      );

      return res.status(201).json({
        success: true,
        message: "Product added to cart successfully",
        data: cartItem,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateCartItem(req: Request, res: Response) {
    try {
const userId = Number((req as any).user.userId);      const productId = Number(req.params.productId);
      const quantity = Number(req.body.quantity);

      const cartItem = await this.cartService.updateCartItem(
        userId,
        productId,
        quantity
      );

      return res.status(200).json({
        success: true,
        message: "Cart item updated successfully",
        data: cartItem,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async removeProductFromCart(req: Request, res: Response) {
    try {
const userId = Number((req as any).user.userId);
      const productId = Number(req.params.productId);

      await this.cartService.removeProductFromCart(
        userId,
        productId
      );

      return res.status(200).json({
        success: true,
        message: "Product removed from cart successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async clearCart(req: Request, res: Response) {
    try {
const userId = Number((req as any).user.userId);
      await this.cartService.clearCart(userId);

      return res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}