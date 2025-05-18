import LocalStorage from "./Lib_LocalStorage";
import UserLib from "./Lib_User";

const Lib = {

	/**
	 * LocalStorage utilities for interacting with browser local storage.
	 */
	LocalStorage: LocalStorage,

	/**
	 * Array utilities for common array operations.
	 */
	Arrays: {
		/**
		 * Returns a new array with only unique values.
		 * @param array - The array to filter for unique values.
		 * @returns A new array with unique values.
		 */
		unique: ( array: unknown[] ): unknown[] => {
			return Array.from( new Set( array ) );
		},

		/**
		 * Checks if two arrays are equal by comparing their JSON string representations.
		 * @param arr1 - The first array to compare.
		 * @param arr2 - The second array to compare.
		 * @returns True if the arrays are equal, false otherwise.
		 */
		isArrayEqual: ( arr1: unknown[], arr2: unknown[] ): boolean => {
			return JSON.stringify( arr1 ) === JSON.stringify( arr2 );
		},

		/**
		 * Filters out falsy values from an array.
		 * @param array - The array to filter.
		 * @returns A new array with only truthy values.
		 */
		filterFalsyValues: ( array: unknown[] ): unknown[] => {
			return array.filter( Boolean );
		}
	},

	/**
	 * User validation utilities for validating user input.
	 */
	User: UserLib,

	/**
	 * String utilities for common string operations.
	 */
	Objects: {
		/**
		 * Merges two objects into one.
		 * @param target - The target object to merge into.
		 * @param source - The source object to merge from.
		 * @returns The merged object.
		 */
		merge: ( target: object, source: object ): object => {
			return { ...target, ...source };
		},

		/**
		 * @description Logs the keys of the object to the console.
		 * @param obj - The object to log keys from.
		 * @returns void
		 */
		logKeys: ( obj: object ): void => {
			console.log( "Object keys:", Object.keys( obj ) );
		},

		/**
		 * Checks if an object is empty (has no keys).
		 * @param obj - The object to check.
		 * @returns True if the object is empty, false otherwise.
		 */
		isEmptyObject: ( obj: object ): boolean => {
			return Object.keys( obj ).length === 0;
		},

		/**
		 * Checks if two objects are deeply equal by comparing their JSON string representations.
		 * @param obj1 - The first object to compare.
		 * @param obj2 - The second object to compare.
		 * @returns True if the objects are equal, false otherwise.
		 */
		isObjectEqual: ( obj1: object, obj2: object ): boolean => {
			return JSON.stringify( obj1 ) === JSON.stringify( obj2 );
		}
	},

	/**
	 * File utilities for common file operations.
	 */
	Files: {
		/**
		 * Triggers a file download in the browser.
		 * @param data - The file data as a Blob.
		 * @param filename - The name of the file to download.
		 */
		downloadFile: ( data: Blob, filename: string ): void => {
			const url = window.URL.createObjectURL( data );
			const link = document.createElement( "a" );
			link.href = url;
			link.download = filename;
			link.click();
			window.URL.revokeObjectURL( url );
		}
	},

	/**
	 * Capitalizes the first letter of a string.
	 * @param str - The string to capitalize.
	 * @returns The capitalized string.
	 */
	capitalize: ( str: string ): string => {
		if ( !str ) { return ""; }
		return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
	},

	/**
	 * Capitalizes the first letter of each word in a string.
	 * @param str - The string to capitalize.
	 * @returns The string with each word capitalized.
	 */
	capitalizeEachWord: ( str: string ): string => {
		return str
			.split( " " )
			.map( ( word ) => Lib.capitalize( word ) )
			.join( " " );
	},

	/**
	 * Formats a date string into a human-readable format.
	 * @param {String} dateString - The date string to format.
	 * @returns {String} The formatted date string or "Invalid date" if the input is not a valid date.
	 */
	formatDate: function ( dateStr: string ): string {
		const date = new Date( dateStr );
		if ( isNaN( date.getTime() ) ) {
			return "Invalid date";
		}
		return new Intl.DateTimeFormat( "en-US", {
			timeZone: "UTC",
			dateStyle: "short",
			timeStyle: "medium"
		} ).format( date );
	},

	/**
	 * Generates a random integer between a minimum and maximum value (inclusive).
	 * @param min - The minimum value.
	 * @param max - The maximum value.
	 * @returns A random integer between min and max.
	 */
	randomInt: ( min: number, max: number ): number => {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	},

	/**
	 * Checks if a string represents a valid number.
	 * @param str - The string to check.
	 * @returns True if the string is a valid number, false otherwise.
	 */
	checkIfStringIsNumber: ( str: string ): boolean => {
		return !isNaN( Number( str ) );
	},

	/**
	 * Generates a UUID (Universally Unique Identifier).
	 * @returns A randomly generated UUID.
	 */
	generateUUID: (): string => {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace( /[xy]/g, ( char ) => {
			const random = ( Math.random() * 16 ) | 0;
			const value = char === "x" ? random : ( random & 0x3 ) | 0x8;
			return value.toString( 16 );
		} );
	},

	/**
	 * Copies a string to the clipboard.
	 * @param text - The text to copy to the clipboard.
	 */
	copyToClipboard: ( text: string ): void => {
		navigator.clipboard.writeText( text ).catch( ( err ) => {
			throw new Error( `Failed to copy text: ${ err }` );
		} );
	},

	/**
	 * Formats a number as currency.
	 * @param amount - The amount to format.
	 * @param currency - The currency code (default is USD).
	 * @returns The formatted currency string.
	 */
	formatCurrency: ( amount: number, currency = "USD" ): string => {
		return new Intl.NumberFormat( "en-US", {
			style: "currency",
			currency
		} ).format( amount );
	}
};

export default Lib;