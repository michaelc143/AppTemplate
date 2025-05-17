const LocalStorage = {
	/**
     * Retrieves an item from local storage and parses it as JSON.
     * @param key - The key to get from local storage.
     * @returns The value from local storage or null if not found.
     */
	getLocalStorageItem: ( key: string ): string | null => {
		const item = localStorage.getItem( key );
		return item ? ( JSON.parse( item ) ) : null;
	},

	/**
     * Stores an item in local storage as a JSON string.
     * @param key - The key to set in local storage.
     * @param value - The value to store in local storage.
     */
	setLocalStorageItem: ( key: string, value: unknown ): void => {
		localStorage.setItem( key, JSON.stringify( value ) );
	},

	/**
     * Removes an item from local storage.
     * @param key - The key to remove from local storage.
     */
	removeLocalStorageItem: ( key: string ): void => {
		localStorage.removeItem( key );
	}
};

export default LocalStorage;