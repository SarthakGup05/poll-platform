import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.get("/", (_, res) => {
  res.send("Poll Platform API Running");
});

app.use("/api/auth", authRoutes);

export default app;