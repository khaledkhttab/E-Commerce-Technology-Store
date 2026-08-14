import { CartService } from "./src/services/cart.service.js";

async function test() {
  const cartService = new CartService();

  // غيّر userId لو عندك User مختلف
  const userId = 5;

  console.log("\n========================================");
  console.log("TEST 1 - GET OR CREATE CART");
  console.log("========================================");

  try {
    const cart = await cartService.getCart(userId);

    console.log("Cart:");
    console.dir(cart, { depth: null });
  } catch (error: any) {
    console.log("ERROR:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 2 - ADD PRODUCT TO CART");
  console.log("========================================");

  try {
    const item = await cartService.addProductToCart(
      userId,
      123,
      2
    );

    console.log("Product added:");
    console.dir(item, { depth: null });
  } catch (error: any) {
    console.log("ERROR:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 3 - ADD SAME PRODUCT AGAIN");
  console.log("========================================");

  try {
    const item = await cartService.addProductToCart(
      userId,
      123,
      3
    );

    console.log("Product quantity increased:");
    console.dir(item, { depth: null });
  } catch (error: any) {
    console.log("ERROR:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 4 - INVALID QUANTITY");
  console.log("========================================");

  try {
    await cartService.addProductToCart(
      userId,
      123,
      0
    );
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 5 - PRODUCT NOT FOUND");
  console.log("========================================");

  try {
    await cartService.addProductToCart(
      userId,
      999999,
      1
    );
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("CART SERVICE TEST COMPLETED");
  console.log("========================================");
}

test();