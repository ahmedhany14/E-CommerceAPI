import { AppRouter } from "../app";
import { metadataKeys } from "./../interfaces/MeteData";
import { methods } from "./../interfaces/Methods";

const router = AppRouter.getInstance();

export function Controller(routePrefix: string) {
    return function (target: Function) {
        const routeHandlers = Object.getOwnPropertyNames(target.prototype)

        for (let key of routeHandlers) {
            const functionHandler = target.prototype[key];

            const path = Reflect.getMetadata(metadataKeys.path, target.prototype, key);
            const method: methods = Reflect.getMetadata(metadataKeys.method, target.prototype, key);
            const middlewares = Reflect.getMetadata(metadataKeys.middleware, target.prototype, key) || [];

            if (path) {
                router[method](
                    `${routePrefix}${path}`,
                    ...middlewares,
                    functionHandler
                );
            }
        }
    }
}