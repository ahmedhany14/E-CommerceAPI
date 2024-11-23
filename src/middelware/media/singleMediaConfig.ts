import { Request } from "express";
import multer from "multer";
import { AppError } from "../../utils/AppError";

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: any, callback: Function) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback(new AppError("Not an image! Please upload only images.", 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

export const uploadMedia = upload.single("photo");