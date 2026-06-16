import fs from "node:fs/promises";
import path from "node:path";
import { generateStoredFileName } from "../utils/fileNameGenerator";
import { FileCategory, getFileCategory, isValidCategory } from "../utils/fileValidator";

const uploadsRoot = path.resolve(process.cwd(), "uploads");

export type StoredFile = {
  originalName: string;
  fileName: string;
  fileKey: string;
  url: string;
  mimeType: string;
  size: number;
  category: FileCategory;
};

function getBaseUrl(): string {
  return (process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/$/, "");
}

function resolveFilePath(fileKey: string): string {
  const normalizedKey = fileKey.replace(/\\/g, "/");
  const [category, fileName, ...rest] = normalizedKey.split("/");

  if (!category || !fileName || rest.length > 0 || !isValidCategory(category)) {
    throw new Error("Invalid file key.");
  }

  const resolvedPath = path.resolve(uploadsRoot, category, fileName);
  const categoryRoot = path.resolve(uploadsRoot, category);

  if (!resolvedPath.startsWith(`${categoryRoot}${path.sep}`)) {
    throw new Error("Invalid file path.");
  }

  return resolvedPath;
}

export async function uploadFile(file: Express.Multer.File): Promise<StoredFile> {
  const category = getFileCategory(file);
  const fileName = generateStoredFileName(file.originalname);
  const fileKey = `${category}/${fileName}`;
  const destination = resolveFilePath(fileKey);

  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, file.buffer);

  return {
    originalName: file.originalname,
    fileName,
    fileKey,
    url: getFileUrl(fileKey),
    mimeType: file.mimetype,
    size: file.size,
    category
  };
}

export async function deleteFile(fileKey: string): Promise<void> {
  const filePath = resolveFilePath(fileKey);
  await fs.unlink(filePath);
}

export function getFileUrl(fileKey: string): string {
  const normalizedKey = fileKey.replace(/\\/g, "/");
  return `${getBaseUrl()}/uploads/${normalizedKey}`;
}
