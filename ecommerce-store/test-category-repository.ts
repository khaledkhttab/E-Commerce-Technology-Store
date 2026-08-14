import { CategoryRepository } from "./src/repositories/category.repository.js";

async function test() {
  const categoryRepository = new CategoryRepository();

  console.log("\n========================================");
  console.log("TEST 1 - FIND MULTIPLE CATEGORIES");
  console.log("========================================");

  const categories = await categoryRepository.findByIds([10, 11, 12]);

  console.log(categories);

  console.log("\n========================================");
  console.log("TEST 2 - FIND CATEGORIES WITH MISSING ID");
  console.log("========================================");

  const categoriesWithMissingId =
    await categoryRepository.findByIds([11, 12, 9989999]);

  console.log(categoriesWithMissingId);

  console.log("\n========================================");
  console.log("CATEGORY REPOSITORY TEST COMPLETED");
  console.log("========================================");
}

test();