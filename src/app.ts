import express from 'express';

export class AppRouter {
    // privte static means that this property is only accessible from within the class
    private static instance: express.Router;


    // static method that returns the instance of the class

    static getInstance(): express.Router {
        if (!AppRouter.instance) {
            AppRouter.instance = express.Router();
        }
        return AppRouter.instance;
    }

}