import { Request } from 'express';
export interface requestBody extends Request {
    user: {
        id: string;
        profileID: string;
        email: string;
        role: string;
    };
}