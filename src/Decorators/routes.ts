import 'reflect-metadata';
import { methods } from '../interfaces/Methods';
import { metadataKeys } from '../interfaces/MeteData';

function routeBinder(method: string) {
    return function (path: string) {
        return function (target: any, key: string) {
            Reflect.defineMetadata(metadataKeys.path, path, target, key);
            Reflect.defineMetadata(metadataKeys.method, method, target, key);
        }
    }
}

export const Get = routeBinder(methods.get);
export const Post = routeBinder(methods.post);
export const Put = routeBinder(methods.put);
export const Delete = routeBinder(methods.delete);
export const Patch = routeBinder(methods.patch);