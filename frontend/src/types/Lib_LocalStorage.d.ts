/* eslint-disable no-unused-vars */
declare const LocalStorage: {
    getLocalStorageItem( key: string ): string | null;
    setLocalStorageItem( key: string, value: unknown ): void;
    removeLocalStorageItem( key: string ): void;
};

export default LocalStorage;