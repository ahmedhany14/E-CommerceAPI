import { NextFunction, Request, Response } from 'express';

export const catchErrors = function (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({
        message: err.message,
        status: err.status,
    });
}