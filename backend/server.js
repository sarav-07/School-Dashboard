import express from "express";
import cors from "cors";
import { connectDB } from "./connection/db.js";
import { config } from "dotenv";
import authRoutes from "./routes/auth.js";
import principalRoutes from "./routes/prinicipal.js"
import studentRoutes from "./routes/student.js";
import teacherRoutes from "./routes/teacher.js";

const app = express();
app.use(cors());

config({ path: "./config/config.env" });
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", principalRoutes);
app.use("/api", teacherRoutes);
app.use("/api", studentRoutes);

connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server is running successfully at ${PORT}`)
);
