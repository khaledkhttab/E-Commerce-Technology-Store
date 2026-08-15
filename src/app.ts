import express from "express";
import prisma from "./config/prisma.js";
import cartRoutes from "./routes/cart.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import discountRoutes from "./routes/discount.routes.js";
import productSpecificationRoutes from "./routes/product-specification.routes.js";
import productKeywordRoutes from "./routes/product-keyword.routes.js";
import keywordRoutes from "./routes/keyword.routes.js";
import paymentProofRoutes from "./routes/payment-proof.routes.js";
import adminApplicationRoutes from "./routes/admin-application.routes.js";


const app = express();

app.use(express.json());

app.use("/cart", cartRoutes);
app.use("/brands", brandRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);
app.use("/payments", paymentRoutes);
app.use("/reviews", reviewRoutes);
app.use("/discounts", discountRoutes);
app.use(
  "/product-specifications",
  productSpecificationRoutes
);
app.use("/product-keywords", productKeywordRoutes);
app.use("/keywords", keywordRoutes);
app.use("/payment-proofs", paymentProofRoutes);
app.use(
  "/admin-applications",
  adminApplicationRoutes
);


app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "OK",
      database: "Connected",
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    res.status(500).json({
      status: "ERROR",
      database: "Disconnected",
    });
  }
});

export default app;

