import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import doctorRoutes from "./routes/doctor.route";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/doctor", doctorRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


