import type { Request } from "express";
import multer, { type FileFilterCallback } from "multer";

// define the uploaded file will be preserved in the RAM
// then :
//  uploaded into the cloud provider.
//  no need to temp it in the disk.
const storage = multer.memoryStorage();

// Allowed MIME types
const allowedImageTypes = ["image/jpeg", "image/png"];

const uploadPhoto = multer({
	storage,
	limits: {
		fieldSize: 5 * 1024 * 1024,
	},

	fileFilter: (
		req: Request,
		file: Express.Multer.File,
		cb: FileFilterCallback,
	) => {
		if (allowedImageTypes.includes(file.mimetype)) {
			cb(null, true); //accept file
		} else {
			cb(new Error("only images allowed")); //throw an error
		}
	},
});

export default uploadPhoto;
