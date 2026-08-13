import { ProductRepository } from "./src/repositories/product.repository.js";

async function test() {
  const productRepository = new ProductRepository();

  console.log("\n========================================");
  console.log("TEST 1 - CREATE PRODUCT");
  console.log("========================================");

  const createdProduct = await productRepository.create({
    name: "Repository Test Product",
    description: "Product created for repository testing.",
    price: 999,
    stockQuantity: 10,
    image: "https://example.com/test-product.jpg",
    brandId: 3,
  });

  console.log("Created Product:");
  console.log(createdProduct);

  const productId = createdProduct.id;

  console.log("\n========================================");
  console.log("TEST 2 - FIND CREATED PRODUCT");
  console.log("========================================");

  const foundProduct = await productRepository.findById(productId);

  console.log("Found Product:");
  console.log(foundProduct);

  console.log("\n========================================");
  console.log("TEST 3 - UPDATE PRODUCT");
  console.log("========================================");

  const updatedProduct = await productRepository.update(productId, {
    name: "Updated Repository Test Product",
    price: 1199,
  });

  console.log("Updated Product:");
  console.log(updatedProduct);

  console.log("\n========================================");
  console.log("TEST 4 - UPDATE STOCK");
  console.log("========================================");

  const stockUpdatedProduct = await productRepository.updateStock(
    productId,
    25,
  );

  console.log("Stock Updated Product:");
  console.log(stockUpdatedProduct);

  console.log("\n========================================");
  console.log("TEST 5 - DEACTIVATE PRODUCT");
  console.log("========================================");

  const deactivatedProduct =
    await productRepository.deactivate(productId);

  console.log("Deactivated Product:");
  console.log(deactivatedProduct);

  console.log("\n========================================");
  console.log("TEST 6 - VERIFY FINAL PRODUCT");
  console.log("========================================");

  const finalProduct = await productRepository.findById(productId);

  console.log("Final Product:");
  console.log(finalProduct);

  console.log("\n========================================");
  console.log("ALL REPOSITORY TESTS COMPLETED");
  console.log("========================================");
}

test();