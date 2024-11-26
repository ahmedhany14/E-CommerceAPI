import { Request, Response, NextFunction } from "express";
import { AppError } from "../Common/utils/AppError";

export const CheckBody = (Body: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log(Body)
        for (let key of Body) {
            if (req.body[key] === null || req.body[key] === undefined) {
                return next(new AppError(`Please provide ${key} in the body`, 400));
            }
        }
        next();
    }
}