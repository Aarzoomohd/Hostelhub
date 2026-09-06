import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import hostelRoutes from "./routes/hostelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();



const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/hostel", hostelRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payment", paymentRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

