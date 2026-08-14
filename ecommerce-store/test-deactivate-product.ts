import { ProductService } from "./src/services/product.service.js";

async function test() {
  const productService = new ProductService();

  const productId = 123;

  console.log("\n========================================");
  console.log("TEST 1 - DEACTIVATE PRODUCT");
  console.log("========================================");

  try {
    const product = await productService.deactivateProduct(productId);

    console.log("Product deactivated successfully:");
    console.log({
      id: product.id,
      name: product.name,
      isActive: product.isActive,
    });
  } catch (error: any) {
    console.log("ERROR:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 2 - PRODUCT NOT FOUND");
  console.log("========================================");

  try {
    await productService.deactivateProduct(999999);
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("DEACTIVATE PRODUCT TEST COMPLETED");
  console.log("========================================");
}

test();