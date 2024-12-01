import { Request } from 'express';

export interface Itoken {
    token: string;
}

export interface Iuser {
    userInfo: {
        id: string;
        profileID: string;
        email: string;
        role: string;
    }
}

export interface requestAuth extends Itoken, Request, Iuser { }
export interface requestBody extends Request, Iuser { }