import { ProductService } from "./src/services/product.service.js";

async function test() {
  const productService = new ProductService();

  // استخدم Product ID اللي اتعمل في اختبار الـcreate
  const productId = 123;

  console.log("\n========================================");
  console.log("TEST 1 - UPDATE PRODUCT NAME");
  console.log("========================================");

  try {
    const product = await productService.updateProduct(productId, {
      name: "ASUS ROG Updated Laptop",
    });

    console.log("Updated successfully:");
    console.log(product);
  } catch (error: any) {
    console.log("ERROR:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 2 - UPDATE PRICE");
  console.log("========================================");

  try {
    const product = await productService.updateProduct(productId, {
      price: 55000,
    });

    console.log("Updated successfully:");
    console.log(product);
  } catch (error: any) {
    console.log("ERROR:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 3 - UPDATE BRAND");
  console.log("========================================");

  try {
    const product = await productService.updateProduct(productId, {
      brandId: 4,
    });

    console.log("Updated successfully:");
    console.log(product);
  } catch (error: any) {
    console.log("ERROR:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 4 - UPDATE CATEGORIES");
  console.log("========================================");

  try {
    const product = await productService.updateProduct(productId, {
      categoryIds: [6, 5],
    });

    console.log("Updated successfully:");
    console.log(product);
  } catch (error: any) {
    console.log("ERROR:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 5 - INVALID PRICE");
  console.log("========================================");

  try {
    await productService.updateProduct(productId, {
      price: 0,
    });
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 6 - NEGATIVE STOCK");
  console.log("========================================");

  try {
    await productService.updateProduct(productId, {
      stockQuantity: -10,
    });
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 7 - INVALID BRAND");
  console.log("========================================");

  try {
    await productService.updateProduct(productId, {
      brandId: 9999,
    });
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 8 - INVALID CATEGORY");
  console.log("========================================");

  try {
    await productService.updateProduct(productId, {
      categoryIds: [6, 9999],
    });
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 9 - EMPTY CATEGORIES");
  console.log("========================================");

  try {
    await productService.updateProduct(productId, {
      categoryIds: [],
    });
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("TEST 10 - PRODUCT NOT FOUND");
  console.log("========================================");

  try {
    await productService.updateProduct(999999, {
      name: "Does Not Exist",
    });
  } catch (error: any) {
    console.log("Expected Error:", error.message);
  }

  console.log("\n========================================");
  console.log("UPDATE PRODUCT TEST COMPLETED");
  console.log("========================================");
}

test();