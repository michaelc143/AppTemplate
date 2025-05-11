export const apiRequest = async (
	url: string,
	method = "GET",
	body: Record<string, unknown> | null = null,
	headers: Record<string, string> = {}
): Promise<Response> => {
	try {
		const response = await fetch( url, {
			method,
			headers: {
				"Content-Type": "application/json",
				...headers
			},
			body: body ? JSON.stringify( body ) : null
		} );
		return response;
	} catch ( error ) {
		console.error( "API Request Error:", error );
		throw error;
	}
};

export const isValidUsername = ( username: string ): boolean => {
	// Alphanumeric and underscores, 3-20 characters
	const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
	return usernameRegex.test( username );
};

export const isEmptyObject = ( obj: Record<string, unknown> ): boolean => {
	return Object.keys( obj ).length === 0;
};

export const getLocalStorageItem = ( key: string ): string | null => {
	const item = localStorage.getItem( key );
	return item ? ( JSON.parse( item ) ) : null;
};

export const setLocalStorageItem = ( key: string, value: unknown ): void => {
	localStorage.setItem( key, JSON.stringify( value ) );
};

export const removeLocalStorageItem = ( key: string ): void => {
	localStorage.removeItem( key );
};

export const capitalize = ( str: string ): string => {
	if ( !str ) {return "";}
	return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
};

export const generateUUID = (): string => {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace( /[xy]/g, ( char ) => {
		const random = ( Math.random() * 16 ) | 0;
		const value = char === "x" ? random : ( random & 0x3 ) | 0x8;
		return value.toString( 16 );
	} );
};

export const copyToClipboard = ( text: string ): void => {
	navigator.clipboard.writeText( text ).then(
		() => console.log( "Text copied to clipboard" ),
		( err ) => console.error( "Failed to copy text: ", err )
	);
};

export const isObjectEqual = ( obj1: Record<string, unknown>, obj2: Record<string, unknown> ): boolean => {
	return JSON.stringify( obj1 ) === JSON.stringify( obj2 );
};