import { Router } from "express";
import { deleteFile, listFiles, uploadFile } from "../controllers/file.controller";
import { upload } from "../config/multer.config";

export const fileRouter = Router();

fileRouter.get("/", listFiles);
fileRouter.post("/upload", upload.single("file"), uploadFile);
fileRouter.delete("/:type/:filename", deleteFile);
