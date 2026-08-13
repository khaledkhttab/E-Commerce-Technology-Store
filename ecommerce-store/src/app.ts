import express from "express";
import prisma from "./config/prisma.js";
import cartRoutes from "./routes/cart.routes.js";

const app = express();

app.use(express.json());

app.use("/cart", cartRoutes);

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