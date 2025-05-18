import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, act, waitFor } from "@testing-library/react";
import { AuthContext } from "../../../contexts/AuthContext";
import { UserContext } from "../../../contexts/UserContext";
import { ToastContext } from "../../../contexts/ToastContext";
import Follower from "../../Dashboard Components/Follower";

describe( "Follower", () => {
	const mockUser = {
		userId: "1",
		username: "testuser",
		email: "testuser@example.com",
		dateJoined: "2022-01-01",
		accessToken: "mockAccessToken"
	};

	beforeEach( () => {
		global.fetch = jest.fn( () =>
			Promise.resolve(
				new Response(
					JSON.stringify( {
						user_id: "2",
						username: "followeruser",
						email: "follower@example.com",
						date_joined: "2022-01-02"
					} ),
					{ status: 200, headers: { "Content-Type": "application/json" } }
				)
			)
		);
	} );

	afterEach( () => {
		jest.restoreAllMocks();
	} );

	test( "renders Follower info when logged in", async () => {
		await act( () => {
			render(
				<Router>
					<AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn: jest.fn() }}>
						<UserContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
							<ToastContext.Provider value={{ showToast: jest.fn() }}>
								<Follower username="followeruser" />
							</ToastContext.Provider>
						</UserContext.Provider>
					</AuthContext.Provider>
				</Router>
			);
		} );

		// Wait for user info to appear
		await waitFor( () => {
			expect( screen.getByText( "followeruser" ) ).toBeInTheDocument();
			expect( screen.getByText( /follower@example.com/i ) ).toBeInTheDocument();
			expect( screen.getByText( /2022-01-02/i ) ).toBeInTheDocument();
		} );
	} );

	test( "redirects to home page when not logged in", async () => {
		await act( () => {
			render(
				<Router>
					<AuthContext.Provider value={{ isLoggedIn: false, setIsLoggedIn: jest.fn() }}>
						<UserContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
							<ToastContext.Provider value={{ showToast: jest.fn() }}>
								<Follower username="followeruser" />
							</ToastContext.Provider>
						</UserContext.Provider>
					</AuthContext.Provider>
				</Router>
			);
		} );
		expect( window.location.pathname ).toBe( "/" );
	} );

	test( "shows error toast on API error", async () => {
		const showToast = jest.fn();
		// Mock fetch to return 404
		global.fetch = jest.fn( () =>
			Promise.resolve(
				new Response(
					JSON.stringify( { message: "User not found" } ),
					{ status: 404, headers: { "Content-Type": "application/json" } }
				)
			)
		);
		await act( () => {
			render(
				<Router>
					<AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn: jest.fn() }}>
						<UserContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
							<ToastContext.Provider value={{ showToast }}>
								<Follower username="doesnotexist" />
							</ToastContext.Provider>
						</UserContext.Provider>
					</AuthContext.Provider>
				</Router>
			);
		} );
		expect( showToast ).toHaveBeenCalledWith( "User not found", "error" );
	} );
} );