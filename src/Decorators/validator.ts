import { metadataKeys } from "./../interfaces/MeteData";


export function validator(...keys: string[]) {
    return function (target: any, key: string) {
        Reflect.defineMetadata(metadataKeys.validator, keys, target, key);
    }
}