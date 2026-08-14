import { ProductService } from "./src/services/product.service.js";

async function test() {
  const productService = new ProductService();

  const productId = 123;

  console.log("\n========================================");
  console.log("TEST 1 - UPDATE STOCK");
  console.log("========================================");

  try {
    const product = await productService.updateStock(productId, 20);

    console.log("Stock updated successfully:");
    console.log({
      id: product.id,
      name: product.name,
      stockQuantity: product.stockQuantity,
    });
  } catch (error: any) {
    console.log("ERROR:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 2 - NEGATIVE STOCK");
  console.log("========================================");

  try {
    await productService.updateStock(productId, -1);
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 3 - PRODUCT NOT FOUND");
  console.log("========================================");

  try {
    await productService.updateStock(999999, 20);
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("UPDATE STOCK TEST COMPLETED");
  console.log("========================================");
}

test();
