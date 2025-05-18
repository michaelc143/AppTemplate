/* eslint-disable no-unused-vars */
import type UserLib from "./Lib_User";

declare const Lib: {
  User: typeof UserLib;
};

declare const LocalStorage: {
    setLocalStorageItem( key: string, value: unknown ): void;
    getLocalStorageItem( key: string ): string | null;
    removeLocalStorageItem( key: string ): void;
};
declare const Arrays: {
    unique( array: unknown[] ): unknown[];
    isArrayEqual( arr1: unknown[], arr2: unknown[] ): boolean;
    filterFalsyValues( array: unknown[] ): unknown[];
};
declare const Objects: {
    merge( target: object, source: object ): object;
    logKeys( obj: object ): void;
    isEmptyObject( obj: object ): boolean;
    isObjectEmpty( obj1: object, obj2: object ): boolean;
};
declare const Files: {
    downloadFile( data: Blob, filename: string ): void;
};
declare const capitalize: ( str: string ) => string;
declare const formatDate: ( datString: string ) => string;
declare const randomInt: ( min: number, max: number ) => number;
declare const checkIfStringIsNumber: ( str: string ) => boolean;
declare const formatCurrency: ( amount: number, currency?: string ) => string;
declare const generateUUID: () => string;
declare const copyToClipboard: ( text: string ) => void;

export default Lib;
