import e, { Request } from 'express';

export interface Itoken {
    token: string;
}

export interface requestAuth extends Itoken , Request{
    user: {
        id: string;
        profileID: string;
        email: string;
        role: string;
    },
}

export interface requestCart extends requestAuth {
    cart:{
        products: Array<string>;
        price: number;
    }
}