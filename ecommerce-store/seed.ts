import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const money = (n: number) => n.toFixed(2);

async function main() {
  console.log("========================================");
  console.log("  E-COMMERCE LARGE DATABASE SEED TEST");
  console.log("========================================");

  // Clean everything so the seed can be safely re-run.
  console.log("\n[1/12] Cleaning database...");

  await prisma.paymentProof.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productKeyword.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.product.deleteMany();
  await prisma.keyword.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ------------------------------------------------------------
  // USERS: 100 customers + 15 admins + 3 super admins = 118
  // ------------------------------------------------------------
  console.log("[2/12] Creating users...");

  const customers = await prisma.user.createManyAndReturn({
    data: Array.from({ length: 100 }, (_, i) => ({
      name: `Customer ${i + 1}`,
      role: "CUSTOMER" as const,
      email: `customer${i + 1}@example.com`,
      password: `hashed_password_${i + 1}`,
    })),
  });

  const admins = await prisma.user.createManyAndReturn({
    data: Array.from({ length: 15 }, (_, i) => ({
      name: `Admin ${i + 1}`,
      role: "ADMIN" as const,
      email: `admin${i + 1}@example.com`,
      password: `hashed_admin_${i + 1}`,
    })),
  });

  const superAdmins = await prisma.user.createManyAndReturn({
    data: Array.from({ length: 3 }, (_, i) => ({
      name: `Super Admin ${i + 1}`,
      role: "SUPER_ADMIN" as const,
      email: `superadmin${i + 1}@example.com`,
      password: `hashed_super_${i + 1}`,
    })),
  });

  const allAdmins = [...admins, ...superAdmins];

  // ------------------------------------------------------------
  // CATEGORIES: 15
  // ------------------------------------------------------------
  console.log("[3/12] Creating categories and brands...");

  const categoryData = [
    { name: "Laptops", type: "LAPTOP" as const },
    { name: "Gaming Laptops", type: "LAPTOP" as const },
    { name: "Ultrabooks", type: "LAPTOP" as const },
    { name: "Smartphones", type: "SMARTPHONE" as const },
    { name: "Android Phones", type: "SMARTPHONE" as const },
    { name: "iPhones", type: "SMARTPHONE" as const },
    { name: "Tablets", type: "TABLET" as const },
    { name: "Gaming Monitors", type: "MONITOR" as const },
    { name: "Office Monitors", type: "MONITOR" as const },
    { name: "PC Components", type: "PC_COMPONENT" as const },
    { name: "Graphics Cards", type: "PC_COMPONENT" as const },
    { name: "Processors", type: "PC_COMPONENT" as const },
    { name: "Storage Accessories", type: "ACCESSORY" as const },
    { name: "Gaming Accessories", type: "ACCESSORY" as const },
    { name: "Other Electronics", type: "OTHER" as const },
  ];

  const categories = await prisma.category.createManyAndReturn({
    data: categoryData,
  });

  const brandNames = [
    "ASUS", "Lenovo", "Apple", "Samsung", "Dell",
    "HP", "Acer", "MSI", "Logitech", "Sony",
    "LG", "Intel", "AMD", "NVIDIA", "Kingston",
  ];

  const brands = await prisma.brand.createManyAndReturn({
    data: brandNames.map((name) => ({ name })),
  });

  // ------------------------------------------------------------
  // PRODUCTS: 120
  // ------------------------------------------------------------
  console.log("[4/12] Creating 120 products...");

  const products = await prisma.product.createManyAndReturn({
    data: Array.from({ length: 120 }, (_, i) => ({
      name: `Technology Product ${i + 1}`,
      description: `High-quality technology product number ${i + 1} for the e-commerce test dataset.`,
      price: money(100 + ((i * 137) % 4900)),
      stockQuantity: 5 + ((i * 17) % 196),
      image: `https://example.com/products/product-${i + 1}.jpg`,
      brandId: brands[i % brands.length].id,
      isActive: i % 13 !== 0,
    })),
  });

  // Product -> Category: multiple categories per product.
  const productCategoryRows: { productId: number; categoryId: number }[] = [];
  for (let i = 0; i < products.length; i++) {
    const first = categories[i % categories.length].id;
    const second = categories[(i * 3 + 4) % categories.length].id;

    productCategoryRows.push({
      productId: products[i].id,
      categoryId: first,
    });

    if (second !== first) {
      productCategoryRows.push({
        productId: products[i].id,
        categoryId: second,
      });
    }
  }

  await prisma.productCategory.createMany({
    data: productCategoryRows,
    skipDuplicates: true,
  });

  // ------------------------------------------------------------
  // KEYWORDS: 40 + ProductKeyword ~300
  // ------------------------------------------------------------
  const keywordNames = [
    "gaming", "office", "student", "professional", "portable",
    "wireless", "bluetooth", "usb-c", "fast-charging", "oled",
    "amoled", "4k", "144hz", "240hz", "mechanical",
    "rgb", "nvidia", "amd", "intel", "ssd",
    "nvme", "ddr5", "ddr4", "wifi-6", "5g",
    "budget", "premium", "new", "popular", "sale",
    "creator", "business", "performance", "compact", "lightweight",
    "high-end", "mid-range", "value", "smart", "accessory",
  ];

  const keywords = await prisma.keyword.createManyAndReturn({
    data: keywordNames.map((name) => ({ name })),
  });

  const productKeywordRows: { productId: number; keywordId: number }[] = [];

  for (let i = 0; i < products.length; i++) {
    for (let offset = 0; offset < 3; offset++) {
      productKeywordRows.push({
        productId: products[i].id,
        keywordId: keywords[(i * 2 + offset * 7) % keywords.length].id,
      });
    }
  }

  await prisma.productKeyword.createMany({
    data: productKeywordRows,
    skipDuplicates: true,
  });

  // ------------------------------------------------------------
  // SPECIFICATIONS: 5 per product = 600
  // ------------------------------------------------------------
  const specificationTemplates = [
    ["Processor", "Intel/AMD/Apple Silicon"],
    ["Memory", "16 GB"],
    ["Storage", "512 GB SSD"],
    ["Display", "15.6 inch"],
    ["Warranty", "1 Year"],
  ];

  const specificationRows = products.flatMap((product, productIndex) =>
    specificationTemplates.map(([name, baseValue], specIndex) => ({
      productId: product.id,
      name,
      value: `${baseValue} - Model ${productIndex + 1}.${specIndex + 1}`,
    }))
  );

  await prisma.productSpecification.createMany({
    data: specificationRows,
  });

  // ------------------------------------------------------------
  // DISCOUNTS: 120 products x multiple discounts over time.
  // Product 1:N Discount is intentionally tested.
  // ------------------------------------------------------------
  console.log("[5/12] Creating discounts...");

  const discountRows = products.flatMap((product, i) => [
    {
      productId: product.id,
      value: money(5 + (i % 16)),
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-01-15T23:59:59Z"),
    },
    {
      productId: product.id,
      value: money(10 + (i % 21)),
      startDate: new Date("2026-06-01T00:00:00Z"),
      endDate: new Date("2026-06-15T23:59:59Z"),
    },
  ]);

  await prisma.discount.createMany({ data: discountRows });

  // ------------------------------------------------------------
  // CARTS: 100 (one per customer), 400 cart items
  // ------------------------------------------------------------
  console.log("[6/12] Creating carts and cart items...");

  const carts = await prisma.cart.createManyAndReturn({
    data: customers.map((customer) => ({
      userId: customer.id,
    })),
  });

  const cartItemRows: {
    cartId: number;
    productId: number;
    quantity: number;
  }[] = [];

  for (let i = 0; i < carts.length; i++) {
    const itemCount = 3 + (i % 3);

    for (let j = 0; j < itemCount; j++) {
      cartItemRows.push({
        cartId: carts[i].id,
        productId: products[(i * 5 + j * 11) % products.length].id,
        quantity: 1 + ((i + j) % 5),
      });
    }
  }

  await prisma.cartItem.createMany({
    data: cartItemRows,
    skipDuplicates: true,
  });

  // ------------------------------------------------------------
  // ORDERS: 150
  // Each order has 2-4 items.
  // Each order has exactly one Payment.
  // ------------------------------------------------------------
  console.log("[7/12] Creating 150 orders and order items...");

  const baseDate = new Date("2026-08-12T12:00:00Z");

  const orderRows = Array.from({ length: 150 }, (_, i) => {
    const day = String(baseDate.getUTCDate()).padStart(2, "0");
    const month = String(baseDate.getUTCMonth() + 1).padStart(2, "0");
    const year = String(baseDate.getUTCFullYear()).slice(-2);

    return {
      orderNumber: `ORD_${year}-${month}-${day}_${String(i + 1).padStart(6, "0")}`,
      userId: customers[i % customers.length].id,
      status: [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ][i % 6] as
        | "PENDING"
        | "CONFIRMED"
        | "PROCESSING"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED",
      createdAt: new Date(baseDate.getTime() - i * 3600000),
      updatedAt: new Date(baseDate.getTime() - i * 1800000),
    };
  });

  const orders = await prisma.order.createManyAndReturn({
    data: orderRows,
  });

  const orderItemRows: {
    orderId: number;
    productId: number;
    productName: string;
    unitPrice: string;
    quantity: number;
    discount: string;
    subtotal: string;
  }[] = [];

  for (let i = 0; i < orders.length; i++) {
    const itemCount = 2 + (i % 3);

    for (let j = 0; j < itemCount; j++) {
      const product = products[(i * 7 + j * 13) % products.length];
      const unitPrice = 100 + ((i * 137 + j * 73) % 4900);
      const quantity = 1 + ((i + j) % 4);
      const discount = (i + j) % 5 === 0 ? 15 : (i + j) % 7 === 0 ? 10 : 0;
      const subtotal = unitPrice * quantity * (1 - discount / 100);

      orderItemRows.push({
        orderId: orders[i].id,
        productId: product.id,
        productName: product.name,
        unitPrice: money(unitPrice),
        quantity,
        discount: money(discount),
        subtotal: money(subtotal),
      });
    }
  }

  await prisma.orderItem.createMany({ data: orderItemRows });

  // ------------------------------------------------------------
  // PAYMENTS: 150, exactly one per order
  // PaymentProof: only bank-transfer payments get a proof.
  // ------------------------------------------------------------
  console.log("[8/12] Creating payments and payment proofs...");

  const payments = await prisma.payment.createManyAndReturn({
    data: orders.map((order, i) => {
      const bankTransfer = i % 3 !== 0;

      return {
        orderId: order.id,
        paymentMethod: bankTransfer ? "BANK_TRANSFER" as const : "CASH_ON_DELIVERY" as const,
        paymentStatus: bankTransfer
          ? (i % 7 === 0 ? "PENDING_VERIFICATION" as const
            : i % 11 === 0 ? "REJECTED" as const
            : "VERIFIED" as const)
          : "PENDING" as const,
        paidAt:
          bankTransfer && i % 11 !== 0
            ? new Date(baseDate.getTime() - i * 1700000)
            : null,
      };
    }),
  });

  const proofRows = payments
    .filter((_, i) => i % 3 !== 0)
    .map((payment, i) => ({
      paymentId: payment.id,
      proofImageUrl: `https://example.com/payment-proofs/proof-${i + 1}.jpg`,
      uploadedAt: new Date(baseDate.getTime() - i * 1500000),
    }));

  await prisma.paymentProof.createMany({
    data: proofRows,
  });

  // ------------------------------------------------------------
  // ORDER STATUS HISTORY: 5-6 records per order = ~825
  // Admin/SuperAdmin are the actors.
  // ------------------------------------------------------------
  console.log("[9/12] Creating order status histories...");

  const historyRows: {
    orderId: number;
    adminId: number;
    status:
      | "PENDING"
      | "CONFIRMED"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED";
    changedAt: Date;
  }[] = [];

const statusSequence = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

  for (let i = 0; i < orders.length; i++) {
    const finalStatus = orderRows[i].status;
    let statuses: typeof statusSequence[number][];

    if (finalStatus === "CANCELLED") {
      statuses = ["PENDING", "CONFIRMED", "PROCESSING","SHIPPED","DELIVERED","CANCELLED"];
    } else {
      const finalIndex = statusSequence.indexOf(finalStatus as typeof statusSequence[number]);
      statuses = statusSequence.slice(0, Math.max(finalIndex + 1, 1));
    }

    statuses.forEach((status, j) => {
      historyRows.push({
        orderId: orders[i].id,
        adminId: allAdmins[(i + j) % allAdmins.length].id,
        status,
        changedAt: new Date(
          orderRows[i].createdAt.getTime() + j * 900000
        ),
      });
    });
  }

  await prisma.orderStatusHistory.createMany({
    data: historyRows,
  });

  // ------------------------------------------------------------
  // REVIEWS: 300+ reviews, respecting @@unique([userId, productId])
  // ------------------------------------------------------------
  console.log("[10/12] Creating reviews...");

  const reviewRows: {
    userId: number;
    productId: number;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
  }[] = [];

  const reviewPairs = new Set<string>();

  for (let i = 0; reviewRows.length < 350 && i < 5000; i++) {
    const customer = customers[(i * 7) % customers.length];
    const product = products[(i * 11 + 3) % products.length];
    const key = `${customer.id}-${product.id}`;

    if (reviewPairs.has(key)) continue;

    reviewPairs.add(key);

    reviewRows.push({
      userId: customer.id,
      productId: product.id,
      rating: 1 + (i % 5),
      comment: `Test review ${reviewRows.length + 1}: product quality and shopping experience were evaluated.`,
      createdAt: new Date(baseDate.getTime() - i * 600000),
      updatedAt: new Date(baseDate.getTime() - i * 300000),
    });
  }

  await prisma.review.createMany({
    data: reviewRows,
  });

  // ------------------------------------------------------------
  // VERIFICATION
  // ------------------------------------------------------------
  console.log("[11/12] Verifying record counts...");

  const [
    userCount,
    categoryCount,
    brandCount,
    productCount,
    discountCount,
    specificationCount,
    keywordCount,
    productKeywordCount,
    cartCount,
    cartItemCount,
    orderCount,
    orderItemCount,
    paymentCount,
    proofCount,
    historyCount,
    reviewCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.brand.count(),
    prisma.product.count(),
    prisma.discount.count(),
    prisma.productSpecification.count(),
    prisma.keyword.count(),
    prisma.productKeyword.count(),
    prisma.cart.count(),
    prisma.cartItem.count(),
    prisma.order.count(),
    prisma.orderItem.count(),
    prisma.payment.count(),
    prisma.paymentProof.count(),
    prisma.orderStatusHistory.count(),
    prisma.review.count(),
  ]);

  console.log("\n========================================");
  console.log("           FINAL DATABASE COUNTS");
  console.log("========================================");
  console.log(`Users:                 ${userCount}`);
  console.log(`Categories:            ${categoryCount}`);
  console.log(`Brands:                ${brandCount}`);
  console.log(`Products:              ${productCount}`);
  console.log(`Discounts:             ${discountCount}`);
  console.log(`Specifications:        ${specificationCount}`);
  console.log(`Keywords:              ${keywordCount}`);
  console.log(`ProductKeywords:       ${productKeywordCount}`);
  console.log(`Carts:                 ${cartCount}`);
  console.log(`CartItems:             ${cartItemCount}`);
  console.log(`Orders:                ${orderCount}`);
  console.log(`OrderItems:            ${orderItemCount}`);
  console.log(`Payments:              ${paymentCount}`);
  console.log(`PaymentProofs:         ${proofCount}`);
  console.log(`StatusHistories:       ${historyCount}`);
  console.log(`Reviews:               ${reviewCount}`);

  // ------------------------------------------------------------
  // RELATIONSHIP SPOT CHECKS
  // ------------------------------------------------------------
  console.log("\n[12/12] Running relationship spot checks...");

  const sampleProducts = await prisma.product.findMany({
    take: 5,
    include: {
      brand: true,
      categories: { include: { category: true } },
      discounts: true,
      specifications: true,
      keywords: { include: { keyword: true } },
      reviews: true,
    },
  });

  const sampleOrders = await prisma.order.findMany({
    take: 5,
    include: {
      user: true,
      items: { include: { product: true } },
      payment: { include: { proof: true } },
      statusHistory: { include: { admin: true } },
    },
  });

  for (const product of sampleProducts) {
    if (!product.brand) throw new Error(`Product ${product.id} has no brand`);
    if (product.categories.length === 0) throw new Error(`Product ${product.id} has no category`);
    if (product.specifications.length === 0) throw new Error(`Product ${product.id} has no specifications`);
    if (product.keywords.length === 0) throw new Error(`Product ${product.id} has no keywords`);
  }

  for (const order of sampleOrders) {
    if (!order.user) throw new Error(`Order ${order.id} has no user`);
    if (order.items.length === 0) throw new Error(`Order ${order.id} has no items`);
    if (!order.payment) throw new Error(`Order ${order.id} has no payment`);
    if (order.statusHistory.length === 0) throw new Error(`Order ${order.id} has no status history`);

    for (const history of order.statusHistory) {
      if (!["ADMIN", "SUPER_ADMIN"].includes(history.admin.role)) {
        throw new Error(`Invalid admin role on status history ${history.id}`);
      }
    }
  }

  // Verify one user -> one cart.
  const customersWithCarts = await prisma.user.count({
    where: {
      role: "CUSTOMER",
      cart: { isNot: null },
    },
  });

  // Verify one order -> one payment.
  const ordersWithPayments = await prisma.order.count({
    where: {
      payment: { isNot: null },
    },
  });

  // Verify products with multiple discounts.
  const productsWithMultipleDiscounts = await prisma.product.findMany({
    where: {
      discounts: { some: {} },
    },
    include: {
      discounts: true,
    },
    take: 5,
  });

  console.log("\n========================================");
  console.log("          TEST RESULT");
  console.log("========================================");
  console.log(`Customers with carts:       ${customersWithCarts}`);
  console.log(`Orders with payments:        ${ordersWithPayments}`);
  console.log(
    `Products with discounts:     ${productsWithMultipleDiscounts.length} sampled`
  );
  console.log(`Relationship checks:         PASS`);
  console.log(`Database seed:               SUCCESS`);
  console.log("========================================\n");
}

main()
  .catch((error) => {
    console.error("\n❌ SEED FAILED");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });