import UserLib from "../../../helpers/Lib_User";

describe( "UserLib", () => {
	test( "isValidUsername returns true for valid usernames", () => {
		expect( UserLib.isValidUsername( "valid_user" ) ).toBe( true );
		expect( UserLib.isValidUsername( "user123" ) ).toBe( true );
	} );

	test( "isValidUsername returns false for invalid usernames", () => {
		expect( UserLib.isValidUsername( "ab" ) ).toBe( false );
		expect( UserLib.isValidUsername( "user!" ) ).toBe( false );
	} );

	test( "isValidEmail returns true for valid emails", () => {
		expect( UserLib.isValidEmail( "test@example.com" ) ).toBe( true );
	} );

	test( "isValidEmail returns false for invalid emails", () => {
		expect( UserLib.isValidEmail( "invalid-email" ) ).toBe( false );
	} );

	test( "isValidPassword returns true for valid passwords", () => {
		expect( UserLib.isValidPassword( "Password1!" ) ).toBe( true );
	} );

	test( "isValidPassword returns false for invalid passwords", () => {
		expect( UserLib.isValidPassword( "pass" ) ).toBe( false );
	} );
} );
