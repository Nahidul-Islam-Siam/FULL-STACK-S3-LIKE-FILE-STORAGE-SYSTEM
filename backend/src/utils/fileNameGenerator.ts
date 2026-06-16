import crypto from "node:crypto";
import path from "node:path";

const unsafeNamePattern = /[^a-zA-Z0-9._-]/g;

export function sanitizeFileName(fileName: string): string {
  const parsed = path.parse(fileName);
  const safeBase = parsed.name.replace(unsafeNamePattern, "-").replace(/-+/g, "-");
  const safeExt = parsed.ext.toLowerCase().replace(unsafeNamePattern, "");
  return `${safeBase || "file"}${safeExt}`;
}

export function generateStoredFileName(originalName: string): string {
  const safeName = sanitizeFileName(originalName);
  const extension = path.extname(safeName).toLowerCase();
  const baseName = path.basename(safeName, extension);
  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
  return `${baseName}-${uniqueSuffix}${extension}`;
}
