import { Request } from 'express';

export interface requestAuth extends Request {
    token: string;
    user: {
        id: string;
        profileID: string;
        email: string;
        role: string;
    };
}

export interface requestBody extends Request {
    user: {
        id: string;
        profileID: string;
        email: string;
        role: string;
    };
}

