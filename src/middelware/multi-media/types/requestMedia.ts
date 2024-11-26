import { Request } from 'express';
export interface requestMedia extends Request {
    body: {
        images: [any];
        productId: string;
    }
    files: {
        images: []
    },
}

