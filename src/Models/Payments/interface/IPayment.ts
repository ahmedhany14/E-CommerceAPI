import { Request, Response, NextFunction } from 'express';

export interface IPayment{
    createSession(request: Request, response: Response, next: NextFunction): Promise<any>;
}