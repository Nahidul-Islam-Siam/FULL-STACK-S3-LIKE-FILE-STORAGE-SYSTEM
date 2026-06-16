import path from "node:path";

export type FileCategory = "images" | "videos" | "documents";

type Rule = {
  category: FileCategory;
  extensions: string[];
  mimeTypes: string[];
  maxSize: number;
};

const megabyte = 1024 * 1024;

const blockedExtensions = new Set([".exe", ".sh", ".bat"]);

const rules: Rule[] = [
  {
    category: "images",
    extensions: [".jpg", ".jpeg", ".png", ".webp"],
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSize: 5 * megabyte
  },
  {
    category: "videos",
    extensions: [".mp4", ".mov", ".avi"],
    mimeTypes: ["video/mp4", "video/quicktime", "video/x-msvideo"],
    maxSize: 50 * megabyte
  },
  {
    category: "documents",
    extensions: [".pdf", ".doc", ".docx", ".xls", ".xlsx"],
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ],
    maxSize: 10 * megabyte
  }
];

export function getFileCategory(file: Express.Multer.File): FileCategory {
  const extension = path.extname(file.originalname).toLowerCase();

  if (blockedExtensions.has(extension)) {
    throw new Error("Executable and script files are not allowed.");
  }

  if (file.originalname.includes("..") || file.originalname.includes("/") || file.originalname.includes("\\")) {
    throw new Error("Invalid file name.");
  }

  const matchedRule = rules.find((rule) => {
    return rule.extensions.includes(extension) && rule.mimeTypes.includes(file.mimetype);
  });

  if (!matchedRule) {
    throw new Error("File type is not allowed.");
  }

  if (file.size > matchedRule.maxSize) {
    throw new Error(`File is too large for ${matchedRule.category}.`);
  }

  return matchedRule.category;
}

export function isValidCategory(value: string): value is FileCategory {
  return rules.some((rule) => rule.category === value);
}
