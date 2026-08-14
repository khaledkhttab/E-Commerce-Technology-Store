import { ProductService } from "./src/services/product.service.js";

async function test() {
  const productService = new ProductService();

  console.log("\n========================================");
  console.log("TEST 1 - CREATE VALID PRODUCT");
  console.log("========================================");

  try {
    const product = await productService.createProduct({
      name: "ASUS ROG Test Laptop",
      description: "Test product",
      price: 50000,
      stockQuantity: 10,
      image: "test.jpg",
      brandId: 3,
      categoryIds: [4, 5],
    });

    console.log("Product created successfully:");
    console.log(product);
  } catch (error: any) {
    console.log("ERROR:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 2 - INVALID PRICE");
  console.log("========================================");

  try {
    await productService.createProduct({
      name: "Invalid Price Product",
      description: "Test",
      price: 0,
      stockQuantity: 10,
      image: "test.jpg",
      brandId: 3,
      categoryIds: [4],
    });
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 3 - NEGATIVE STOCK");
  console.log("========================================");

  try {
    await productService.createProduct({
      name: "Negative Stock Product",
      description: "Test",
      price: 1000,
      stockQuantity: -5,
      image: "test.jpg",
      brandId: 3,
      categoryIds: [4],
    });
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 4 - INVALID BRAND");
  console.log("========================================");

  try {
    await productService.createProduct({
      name: "Invalid Brand Product",
      description: "Test",
      price: 1000,
      stockQuantity: 10,
      image: "test.jpg",
      brandId: 9999,
      categoryIds: [4],
    });
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 5 - NO CATEGORIES");
  console.log("========================================");

  try {
    await productService.createProduct({
      name: "No Category Product",
      description: "Test",
      price: 1000,
      stockQuantity: 10,
      image: "test.jpg",
      brandId: 3,
      categoryIds: [],
    });
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 6 - INVALID CATEGORY");
  console.log("========================================");

  try {
    await productService.createProduct({
      name: "Invalid Category Product",
      description: "Test",
      price: 1000,
      stockQuantity: 10,
      image: "test.jpg",
      brandId: 3,
      categoryIds: [4, 9999],
    });
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("PRODUCT SERVICE TEST COMPLETED");
  console.log("========================================");
}

test();