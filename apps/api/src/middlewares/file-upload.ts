import type { Request } from "express";
import multer, { type FileFilterCallback } from "multer";

const storage = multer.memoryStorage();

// Allowed document MIME types
const allowedDocumentTypes = ["application/pdf", "application/msword"];

const documentUpload = multer({
	storage,
	limits: {
		fieldSize: 5 * 1024 * 1024, // 5MB
	},
	fileFilter: (
		req: Request,
		file: Express.Multer.File,
		cb: FileFilterCallback,
	) => {
		if (allowedDocumentTypes.includes(file.mimetype)) cb(null, true);
		else cb(new Error("Only document formats are allowed: pdf and doc"));
	},
});

export default documentUpload;
