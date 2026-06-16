import multer from "multer";

const maxUploadSize = 50 * 1024 * 1024;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxUploadSize,
    files: 1
  }
});
