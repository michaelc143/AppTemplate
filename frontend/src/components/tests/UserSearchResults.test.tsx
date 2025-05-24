import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, act } from "@testing-library/react";
import UserSearchResults from "../UserSearchResults";
import { UserContext } from "../../contexts/UserContext";
import { ToastContext } from "../../contexts/ToastContext";
import { User } from "../../interfaces/Interfaces";

const mockSetUser = jest.fn();
const mockShowToast = jest.fn();

const initialUser: User = {
	userId: "testUserId",
	username: "testUser",
	email: "test@example.com",
	dateJoined: "2023-01-01",
	accessToken: "testToken",
	following: [],
	followers: []
};

beforeEach( () => {
	global.fetch = jest.fn( ( url ) => {
		if ( typeof url === "string" && url.includes( "/users/search" ) ) {
			return Promise.resolve(
				new Response(
					JSON.stringify( {
						users: [
							{ username: "alice", email: "alice@example.com", bio: "This is a test bio.", dateJoined: "2022-01-01", userId: "alice123" },
							{ username: "bob", email: "bob@example.com", bio: "This is a test bio.", dateJoined: "2022-01-01", userId: "bob456" }
						]
					} ),
					{ status: 200, headers: { "Content-Type": "application/json" } }
				)
			);
		}
		return Promise.reject( new Error( "Unknown endpoint" ) );
	} );
} );

afterEach( () => {
	jest.restoreAllMocks();
} );

describe( "UserSearchResults", () => {
	test( "renders search results for a query", async () => {
		window.history.pushState( {}, "", "/search?q=ali" );
		await act( () => render(
			<Router>
				<UserContext.Provider value={{ user: initialUser, setUser: mockSetUser }}>
					<ToastContext.Provider value={{ showToast: mockShowToast }}>
						<UserSearchResults />
					</ToastContext.Provider>
				</UserContext.Provider>
			</Router>
		) );
		await ( () => {
			expect( screen.getByText( "alice" ) ).toBeInTheDocument();
			expect( screen.getByText( "bob" ) ).toBeInTheDocument();
		} );
	} );

	test( "shows 'No users found.' if no results", async () => {
		( global.fetch as jest.Mock ).mockImplementationOnce( () =>
			Promise.resolve(
				new Response(
					JSON.stringify( { users: [] } ),
					{ status: 200, headers: { "Content-Type": "application/json" } }
				)
			)
		);
		const searchQuery = "none";
		window.history.pushState( {}, "", `/search?q=${ searchQuery }` );
		await act( () => render(
			<Router>
				<UserContext.Provider value={{ user: initialUser, setUser: mockSetUser }}>
					<ToastContext.Provider value={{ showToast: mockShowToast }}>
						<UserSearchResults />
					</ToastContext.Provider>
				</UserContext.Provider>
			</Router>
		) );
		await ( () => {
			expect( screen.getByText( new RegExp( `No users found matching "${ searchQuery }"`, "i" ) ) ).toBeInTheDocument();
		} );
	} );
} );
