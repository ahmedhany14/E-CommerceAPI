import { Request } from 'express';
export interface requestBody extends Request {
    user: {
        id: string;
        email: string;
        role: string;
    };
}