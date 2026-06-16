import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "node:path";
import { fileRouter } from "./routes/file.routes";

dotenv.config();

export const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/files", fileRouter);

app.use((error: Error, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    res.status(400).json({ message: error.message });
    return;
  }

  if (error) {
    res.status(500).json({ message: error.message || "Internal server error." });
    return;
  }

  next();
});
