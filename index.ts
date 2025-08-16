import express from "express";
const app = express();
const port: number = Number(process.env.PORT) || 5100;
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));


// routes
import authRoutes from "./src/users/user.route";
app.use("/api/auth", authRoutes);

import expenseRoutes from "./src/expenses/expense.route";
app.use("/api/expense", expenseRoutes);

//  database connection
async function bootstrap() {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      console.error("❌ No MongoDB URL found in environment variables.");
      process.exit(1);
    }

    await mongoose.connect(dbUrl);
    console.log("✅ MongoDB Connected!");

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed!", error);
  }
}

// Default route
app.get("/", (req, res) => {
  res.send("Hello from Main Index!");
});

bootstrap();

