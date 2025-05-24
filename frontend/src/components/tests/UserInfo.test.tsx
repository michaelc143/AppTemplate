import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";
import { UserContext } from "../../contexts/UserContext";
import UserInfo from "../UserInfo";

// Mock process.env
const OLD_ENV = process.env;

// Defined here to be accessible in beforeEach
const mockUser = {
	userId: "1",
	username: "testuser",
	email: "testuser@example.com",
	dateJoined: "2022-01-01",
	accessToken: "mockAccessToken",
	bio: "This is a test bio."
};

describe( "UserInfo", () => {
	beforeEach( () => {
		// Most important - it clears the cache
		jest.resetModules();
		// Make a copy
		process.env = { ...OLD_ENV };
		process.env.REACT_APP_API_URL = "http://localhost:5000/api";

		global.fetch = jest.fn( ( url ) => {
			const urlString = url.toString();
			if ( urlString.includes( "/followers" ) ) {
				return Promise.resolve(
					new Response( JSON.stringify( { followers: [ { username: "follower1" }, { username: "follower2" } ] } ), {
						status: 200,
						headers: { "Content-Type": "application/json" }
					} )
				);
			}
			if ( urlString.includes( "/following" ) ) {
				return Promise.resolve(
					new Response( JSON.stringify( { following: [ { username: "following1" } ] } ), {
						status: 200,
						headers: { "Content-Type": "application/json" }
					} )
				);
			}
			// Mock for fetching user's bio or general user data
			const userApiUrl = `${ process.env.REACT_APP_API_URL }/users/${ mockUser.username }`;
			if ( urlString.includes( `/users/${ mockUser.username }/bio` ) || urlString === userApiUrl ) {
				return Promise.resolve(
					new Response( JSON.stringify( { bio: "This is a test bio." } ), {
						status: 200,
						headers: { "Content-Type": "application/json" }
					} )
				);
			}
			return Promise.resolve(
				new Response( JSON.stringify( { message: "Default mock response" } ), {
					status: 200,
					headers: { "Content-Type": "application/json" }
				} )
			);
		} ) as jest.Mock;
	} );

	afterAll( () => {
		// Restore old environment
		process.env = OLD_ENV;
	} );

	test( "renders user info when logged in", async () => {
		const setIsLoggedIn = jest.fn();
		const setUser = jest.fn();

		render(
			<Router>
				<AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn }}>
					<UserContext.Provider value={{ user: mockUser, setUser }}>
						<UserInfo />
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		// Wait for elements that depend on fetched data
		expect( await screen.findByText( /User Info/i ) ).toBeInTheDocument();
		expect( await screen.findByText( /Username: testuser/i ) ).toBeInTheDocument();
		expect(
			await screen.findByText( /Email: testuser@example.com/i )
		).toBeInTheDocument();
		expect( await screen.findByText( /2022-01-01/i ) ).toBeInTheDocument();
		// Check for followers/following counts or specific names if they are rendered
		expect( await screen.findByText( /Followers:/i ) ).toBeInTheDocument();
		expect( await screen.findByText( "follower1" ) ).toBeInTheDocument();
		expect( await screen.findByText( /Following:/i ) ).toBeInTheDocument();
		expect( await screen.findByText( "following1" ) ).toBeInTheDocument();
		// Check for bio if it's fetched and displayed
		expect( await screen.findByText( /Bio: This is a test bio./i ) ).toBeInTheDocument();
	} );

	test( "renders not logged in redirect to /", () => {
		const setIsLoggedIn = jest.fn();
		const setUser = jest.fn();

		const mockUser = {
			userId: "1",
			username: "testuser",
			email: "testuser@example.com",
			dateJoined: "2022-01-01",
			accessToken: "mockAccessToken"
		};

		render(
			<Router>
				<AuthContext.Provider value={{ isLoggedIn: false, setIsLoggedIn }}>
					<UserContext.Provider value={{ user: mockUser, setUser }}>
						<UserInfo />
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);
		// make sure it redirects to home page when not logged in
		expect( window.location.pathname ).toBe( "/" );
		expect( window.location.pathname ).not.toBe( "/userinfo" );
	} );
} );
