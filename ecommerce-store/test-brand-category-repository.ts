import { BrandRepository } from "./src/repositories/brand.repository.js";
import { CategoryRepository } from "./src/repositories/category.repository.js";

async function test() {
  const brandRepository = new BrandRepository();
  const categoryRepository = new CategoryRepository();

  console.log("\n========================================");
  console.log("TEST 1 - FIND BRAND");
  console.log("========================================");

  const brand = await brandRepository.findById(3);

  console.log(brand);

  console.log("\n========================================");
  console.log("TEST 2 - BRAND NOT FOUND");
  console.log("========================================");

  const missingBrand = await brandRepository.findById(9999);

  console.log(missingBrand);

  console.log("\n========================================");
  console.log("TEST 3 - FIND CATEGORY");
  console.log("========================================");

  const category = await categoryRepository.findById(1);

  console.log(category);

  console.log("\n========================================");
  console.log("TEST 4 - CATEGORY NOT FOUND");
  console.log("========================================");

  const missingCategory = await categoryRepository.findById(9999);

  console.log(missingCategory);

  console.log("\n========================================");
  console.log("BRAND/CATEGORY REPOSITORY TESTS COMPLETED");
  console.log("========================================");
}

test();