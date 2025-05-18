import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, act } from "@testing-library/react";
import { AuthContext } from "../../../contexts/AuthContext";
import { ToastContext } from "../../../contexts/ToastContext";
import DashboardList from "../../Dashboard Components/DashboardList";

describe( "DashboardList", () => {

	test( "renders DashboardList when logged in", async () => {
		const setIsLoggedIn = jest.fn();

		await act( () => {
			render(
				<Router>
					<AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn }}>
						<DashboardList />
					</AuthContext.Provider>
				</Router>
			);
		} );

		// Verify that the main functions text is rendered
		expect( screen.getByText( /Main functions/i ) ).toBeInTheDocument();

		// Verify that followers and following are rendered
		expect( screen.getByText( /Followers/i ) ).toBeInTheDocument();
		expect( screen.getByText( /Following/i ) ).toBeInTheDocument();
	} );

	test( "redirects to home page when not logged in", async () => {
		const setIsLoggedIn = jest.fn();

		await act( () => {
			render(
				<Router>
					<AuthContext.Provider value={{ isLoggedIn: false, setIsLoggedIn }}>
						<DashboardList />
					</AuthContext.Provider>
				</Router>
			);
		} );
		// Verify redirection to the home page
		expect( window.location.pathname ).toBe( "/" );
	} );
	
	test( "sets followers to data when logged in", async () => {
		const setIsLoggedIn = jest.fn();

		global.fetch = jest.fn( ( url ) => {
			if ( typeof url === "string" && url.includes( "/followers" ) ) {
				return Promise.resolve(
					new Response(
						JSON.stringify ( {
							followers: [
								{ username: "alice", email: "alice@example.com" },
								{ username: "bob", email: "bob@example.com" }
							]
						} ),
						{ status: 200, headers: { "Content-Type": "application/json" } }
					)
				);
			}
			if ( typeof url === "string" && url.includes( "/following" ) ) {
				return Promise.resolve(
					new Response(
						JSON.stringify ( {
							following: []
						} ),
						{ status: 200, headers: { "Content-Type": "application/json" } }
					)
				);
			}
			if ( typeof url === "string" && url.includes( "/alice" ) ) {
				return Promise.resolve(
					new Response(
						JSON.stringify ( {
							user_id: "1",
							username: "alice",
							email: "alice@example.com",
							date_joined: "2022-01-01"
						} ),
						{ status: 200, headers: { "Content-Type": "application/json" } }
					)
				);
			}
			if ( typeof url === "string" && url.includes( "/bob" ) ) {
				return Promise.resolve(
					new Response(
						JSON.stringify ( {
							user_id: "2",
							username: "bob",
							email: "bob@example.com",
							date_joined: "2022-01-02"
						} ),
						{ status: 200, headers: { "Content-Type": "application/json" } }
					)
				);
			}
			// Default: return a 404 response
			return Promise.resolve(
				new Response(
					JSON.stringify ( { message: "Not Found" } ),
					{ status: 404, headers: { "Content-Type": "application/json" } }
				)
			);
		} );

		await act( () => {
			render(
				<Router>
					<AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn }}>
						<DashboardList />
					</AuthContext.Provider>
				</Router>
			);
		} );

		await screen.findByText( /Main functions/i );
		expect( screen.getByText( /alice@example.com/i ) ).toBeInTheDocument();
		expect( screen.getByText( /bob@example.com/i ) ).toBeInTheDocument();
	} );

	test ( "shows toast on 404 response", async () => {
		const setIsLoggedIn = jest.fn();
		const showToast = jest.fn();
		global.fetch = jest.fn ( () =>
			Promise.resolve (
				new Response (
					JSON.stringify ( { message: "Not Found: The requested resource could not be found." } ),
					{ status: 404, headers: { "Content-Type": "application/json" } }
				)
			)
		);
		await act ( () => {
			render (
				<Router>
					<AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn }}>
						<ToastContext.Provider value={{ showToast }}>
							<DashboardList />
						</ToastContext.Provider>
					</AuthContext.Provider>
				</Router>
			);
		} );
		// Wait for render
		await screen.findByText ( /Main functions/i );
		expect ( showToast ).toHaveBeenCalledWith ( "Not Found: The requested resource could not be found.", "error" );
	} );

	test ( "shows toast on 500 response", async () => {
		const setIsLoggedIn = jest.fn();
		const showToast = jest.fn();
		global.fetch = jest.fn ( () =>
			Promise.resolve (
				new Response (
					JSON.stringify ( { message: "Internal server error" } ),
					{ status: 500, headers: { "Content-Type": "application/json" } }
				)
			)
		);
		await act ( () => {
			render (
				<Router>
					<AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn }}>
						<ToastContext.Provider value={{ showToast }}>
							<DashboardList />
						</ToastContext.Provider>
					</AuthContext.Provider>
				</Router>
			);
		} );
		await screen.findByText ( /Main functions/i );
		expect ( showToast ).toHaveBeenCalledWith ( "Internal Server Error: Please try again later.", "error" );
	} );

	test ( "shows toast on unexpected error", async () => {
		const setIsLoggedIn = jest.fn();
		const showToast = jest.fn();
		global.fetch = jest.fn ( () =>
			Promise.resolve (
				new Response (
					JSON.stringify ( { message: "Something else" } ),
					{ status: 418, headers: { "Content-Type": "application/json" } }
				)
			)
		);
		await act ( () => {
			render (
				<Router>
					<AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn }}>
						<ToastContext.Provider value={{ showToast }}>
							<DashboardList />
						</ToastContext.Provider>
					</AuthContext.Provider>
				</Router>
			);
		} );
		await screen.findByText ( /Main functions/i );
		expect ( showToast ).toHaveBeenCalledWith ( "An unexpected error occurred.", "error" );
	} );
} );