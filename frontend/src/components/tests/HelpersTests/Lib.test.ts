import Lib from "../../../helpers/Lib";

describe( "Lib.User", () => {
	test( "isValidUsername returns true for valid usernames", () => {
		expect( Lib.User.isValidUsername( "valid_user" ) ).toBe( true );
		expect( Lib.User.isValidUsername( "user123" ) ).toBe( true );
	} );

	test( "isValidUsername returns false for invalid usernames", () => {
		expect( Lib.User.isValidUsername( "ab" ) ).toBe( false );
		expect( Lib.User.isValidUsername( "user! " ) ).toBe( false );
	} );

	test( "isValidEmail returns true for valid emails", () => {
		expect( Lib.User.isValidEmail( "test@example.com" ) ).toBe( true );
	} );

	test( "isValidEmail returns false for invalid emails", () => {
		expect( Lib.User.isValidEmail( "invalid-email" ) ).toBe( false );
	} );

	test( "isValidPassword returns true for valid passwords", () => {
		expect( Lib.User.isValidPassword( "Password1!" ) ).toBe( true );
	} );

	test( "isValidPassword returns false for invalid passwords", () => {
		expect( Lib.User.isValidPassword( "pass" ) ).toBe( false );
	} );
} );

describe( "Lib.LocalStorage", () => {

	test( "setLocalStorageItem and getLocalStorageItem store and retrieve a value", () => {
		Lib.LocalStorage.setLocalStorageItem( "testKey", "testValue" );
		expect( Lib.LocalStorage.getLocalStorageItem( "testKey" ) ).toBe( "testValue" );
	} );

	test( "removeLocalStorageItem removes a value", () => {
		Lib.LocalStorage.setLocalStorageItem( "testKey", "testValue" );
		Lib.LocalStorage.removeLocalStorageItem( "testKey" );
		expect( Lib.LocalStorage.getLocalStorageItem( "testKey" ) ).toBe( null );
	} );
    
	test( "getLocalStorageItem returns null for non-existent keys", () => {
		expect( Lib.LocalStorage.getLocalStorageItem( "nonExistentKey" ) ).toBe( null );
	} );

	test( "clearLocalStorage clears all items", () => {
		Lib.LocalStorage.setLocalStorageItem( "testKey1", "testValue1" );
		Lib.LocalStorage.setLocalStorageItem( "testKey2", "testValue2" );
		Lib.LocalStorage.clearLocalStorage();
		expect( Lib.LocalStorage.getLocalStorageItem( "testKey1" ) ).toBe( null );
		expect( Lib.LocalStorage.getLocalStorageItem( "testKey2" ) ).toBe( null );
	} );
} );

describe( "Lib", () => {
    
	test( "capitalize capitalizes the first letter of a string", () => {
		expect( Lib.capitalize( "hello world" ) ).toBe( "Hello world" );
		expect( Lib.capitalize( "" ) ).toBe( "" );
		expect( Lib.capitalize( "a" ) ).toBe( "A" );
		expect( Lib.capitalize( "123abc" ) ).toBe( "123abc" );
		expect( Lib.capitalize( "aBc" ) ).toBe( "ABc" );
		expect( Lib.capitalize( "a b c" ) ).toBe( "A b c" );
	} );
    
	test( "capitalizeEachWord capitalizes the first letter of each word in a string", () => {
		expect( Lib.capitalizeEachWord( "hello world" ) ).toBe( "Hello World" );
		expect( Lib.capitalizeEachWord( "" ) ).toBe( "" );
		expect( Lib.capitalizeEachWord( "a" ) ).toBe( "A" );
		expect( Lib.capitalizeEachWord( "123abc" ) ).toBe( "123abc" );
		expect( Lib.capitalizeEachWord( "a b c" ) ).toBe( "A B C" );
		expect( Lib.capitalizeEachWord( "aBc" ) ).toBe( "ABc" );
	} );
    
	test( "formatDate formats a date string into a human-readable format", () => {
		const date = new Date( "2023-10-01T12:00:00Z" );
		const formattedDate = Lib.formatDate( date.toISOString() );
		expect( formattedDate ).toBe( "10/1/23, 12:00:00 PM" );
		const invalidDate = "invalid-date";
		expect( Lib.formatDate( invalidDate ) ).toBe( "Invalid date" );
	} );
    
	test( "randomInt generates a random integer between min and max", () => {
		expect( Lib.randomInt( 1, 10 ) ).toBeGreaterThanOrEqual( 1 );
		expect( Lib.randomInt( 1, 10 ) ).toBeLessThanOrEqual( 10 );
		expect( Lib.randomInt( 1, 10 ) ).not.toBe( Lib.randomInt( 1, 10 ) );
	} );
    
	test( "checkIfStringIsNumber returns true for valid numbers and false for non-numbers", () => {
		expect( Lib.checkIfStringIsNumber( "123" ) ).toBe( true );
		expect( Lib.checkIfStringIsNumber( "abc" ) ).toBe( false );
	} );
    
	test( "formatCurrency formats a number into a currency string", () => {
		expect( Lib.formatCurrency( 123 ) ).toBe( "$123.00" );
		expect( Lib.formatCurrency( 123.45 ) ).toBe( "$123.45" );
	} );
    
	test( "generateUUID generates a valid UUID", () => {
		const uuid = Lib.generateUUID();
		expect( uuid ).toMatch( /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i );
	} ); 
} );

describe( "Lib.Arrays", () => {
	test( "unique returns an array with unique values", () => {
		const arr = [ 1, 2, 2, 3, 4, 4, 5 ];
		const uniqueArr = Lib.Arrays.unique( arr );
		expect( uniqueArr ).toEqual( [ 1, 2, 3, 4, 5 ] );
	} );

	test( "isArrayEqual returns true for equal arrays", () => {
		const arr1 = [ 1, 2, 3 ];
		const arr2 = [ 1, 2, 3 ];
		expect( Lib.Arrays.isArrayEqual( arr1, arr2 ) ).toBe( true );
	} );

	test( "isArrayEqual returns false for unequal arrays", () => {
		const arr1 = [ 1, 2, 3 ];
		const arr2 = [ 1, 2, 4 ];
		expect( Lib.Arrays.isArrayEqual( arr1, arr2 ) ).toBe( false );
	} );

	test( "filterFalsyValues filters out falsy values from an array", () => {
		const arr = [ null, undefined, "", false, 0, NaN, "hello" ];
		const filteredArr = Lib.Arrays.filterFalsyValues( arr );
		expect( filteredArr ).toEqual( [ "hello" ] );
	} );
} );

describe( "Lib.Objects", () => {
	test( "isObjectEqual returns true for equal objects", () => {
		const obj1 = { a: 1, b: 2 };
		const obj2 = { a: 1, b: 2 };
		expect( Lib.Objects.isObjectEqual( obj1, obj2 ) ).toBe( true );
	} );
    
	test( "isObjectEqual returns false for unequal objects", () => {
		const obj1 = { a: 1, b: 2 };
		const obj2 = { a: 1, b: 3 };
		expect( Lib.Objects.isObjectEqual( obj1, obj2 ) ).toBe( false );
	} );
    
	test( "merge merges two objects into one", () => {
		const target = { a: 1, b: 2 };
		const source = { b: 3, c: 4 };
		const merged = Lib.Objects.merge( target, source );
		expect( merged ).toEqual( { a: 1, b: 3, c: 4 } );
	} );
    
	test( "logKeys logs the keys of an object", () => {
		console.log = jest.fn();
		const obj = { a: 1, b: 2 };
		Lib.Objects.logKeys( obj );
		expect( console.log ).toHaveBeenCalledWith( "Object keys:", [ "a", "b" ] );
	} );
} );