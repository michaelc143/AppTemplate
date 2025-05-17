// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Global fetch mock
beforeEach( () => {
	global.fetch = jest.fn( () =>
		Promise.resolve( {
			ok: true,
			json: () =>
				Promise.resolve( {
					success: true,
					username: "testuser",
					email: "testuser@example.com",
					date_joined: "2022-01-01"
				} )
		} as unknown as Response )
	);
} );

afterEach( () => {
	jest.resetAllMocks();
} );

