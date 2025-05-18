import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import UserSearchResults from "../UserSearchResults";

beforeEach( () => {
	global.fetch = jest.fn( ( url ) => {
		if ( typeof url === "string" && url.includes( "/users/search" ) ) {
			return Promise.resolve(
				new Response(
					JSON.stringify( {
						users: [
							{ username: "alice", email: "alice@example.com" },
							{ username: "bob", email: "bob@example.com" }
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
		render(
			<Router>
				<UserSearchResults />
			</Router>
		);
		expect( screen.getByText( /Search Results for/i ) ).toBeInTheDocument();
		await waitFor( () => {
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
		window.history.pushState( {}, "", "/search?q=none" );
		render(
			<Router>
				<UserSearchResults />
			</Router>
		);
		await waitFor( () => {
			expect( screen.getByText( "No users found." ) ).toBeInTheDocument();
		} );
	} );
} );
