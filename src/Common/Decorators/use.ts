import 'reflect-metadata';

import { metadataKeys } from './../interfaces/MeteData';

export function use(middleware: any) {
    return function (target: any, key: string, desc: PropertyDescriptor) {
        const middlewares = Reflect.getMetadata('middleware', target, key) || []; // get all the middlewares that are already defined for this route
        middlewares.push(middleware); // add the new middleware to the array
        Reflect.defineMetadata(metadataKeys.middleware, middlewares, target, key); // save the array back to the metadata
    }

} 