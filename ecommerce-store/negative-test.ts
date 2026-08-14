import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("========================================");
  console.log("      TEST 27 - INVALID STATUS HISTORY ADMIN FOREIGN KEY");
  console.log("========================================");

  const invalidAdminId = 999999999;

  const order = await prisma.order.findFirst();

  if (!order) {
    throw new Error("No Order found");
  }

  try {
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        adminId: invalidAdminId,
        status: "PROCESSING",
      },
    });

    console.log("❌ FAIL - OrderStatusHistory with invalid adminId was accepted.");
  } catch (error) {
    console.log("✅ PASS - Invalid adminId was rejected.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });