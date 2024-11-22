import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const CheckBody = (Body: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        for (let key of Body) {
            if (!req.body[key]) {
                return next(new AppError(`Please provide ${key} in the body`, 400));
            }
        }
        next();
    }
}