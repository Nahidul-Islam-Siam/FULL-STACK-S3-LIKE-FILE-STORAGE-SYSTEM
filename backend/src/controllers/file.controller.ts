import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import * as storageService from "../services/storage.service";
import { isValidCategory } from "../utils/fileValidator";

export async function uploadFile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded." });
      return;
    }

    const storedFile = await storageService.uploadFile(req.file);
    const file = await prisma.fileObject.create({ data: storedFile });

    res.status(201).json({ file });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Upload failed." });
  }
}

export async function listFiles(_req: Request, res: Response): Promise<void> {
  const files = await prisma.fileObject.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ files });
}

export async function deleteFile(req: Request, res: Response): Promise<void> {
  try {
    const { type, filename } = req.params;

    if (!isValidCategory(type) || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      res.status(400).json({ message: "Invalid file path." });
      return;
    }

    const fileKey = `${type}/${filename}`;
    await storageService.deleteFile(fileKey);
    await prisma.fileObject.deleteMany({ where: { fileKey } });

    res.json({ message: "File deleted." });
  } catch (error) {
    res.status(404).json({ message: error instanceof Error ? error.message : "File not found." });
  }
}
