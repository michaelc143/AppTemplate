import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { AuthContext } from "../../contexts/AuthContext";
import { ToastContext } from "../../contexts/ToastContext";
import { UserContext } from "../../contexts/UserContext";
import DeleteAccount from "../DeleteAccount";
import { User } from "../../interfaces/Interfaces";

describe( "DeleteAccount", () => {
	it( "deletes the user account", async () => {
		global.fetch = jest.fn( () =>
			Promise.resolve(
				new Response( JSON.stringify( { success: true } ) )
			)
		);

		const showToast = jest.fn();
		const setUser = jest.fn();
		const setIsLoggedIn = jest.fn();

		const mockUser: User = {
			userId: "1",
			username: "testuser",
			email: "testuser@example.com",
			dateJoined: "2022-01-01",
			accessToken: "mockAccessToken"
		};

		render(
			<Router>
				<AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn }}>
					<UserContext.Provider value={{ user: mockUser, setUser: setUser }}>
						<ToastContext.Provider value={{ showToast }}>
							<DeleteAccount />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		const deleteButton = screen.getByRole( "button", { name: /Delete Account/i } );
		fireEvent.click( deleteButton );

		await waitFor( () => expect( global.fetch ).toHaveBeenCalledTimes( 1 ) );

		expect( global.fetch ).toHaveBeenCalledWith( `${ process.env.REACT_APP_API_URL }/users/testuser`, { method: "DELETE", headers: {"Authorization": "Bearer mockAccessToken"} } );

		expect( setIsLoggedIn ).toHaveBeenCalledWith( false );
		expect( setUser ).toHaveBeenCalledWith( {
			userId: "",
			username: "",
			email: "",
			dateJoined: "",
			accessToken: ""
		} );
		expect( showToast ).toHaveBeenCalledWith( "User deleted successfully", "success" );

		expect( window.location.pathname ).toBe( "/" );
	} );

	it( "redirects to home page if user is not logged in", () => {
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
					<UserContext.Provider value={{ user: mockUser, setUser: setUser}}>
						<ToastContext.Provider value={{ showToast: jest.fn() }}>
							<DeleteAccount />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		expect( window.location.pathname ).toBe( "/" );
	} );
	
	test( "shows error toast if delete fails", async () => {
		global.fetch = jest.fn( () =>
			Promise.resolve(
				new Response(
					JSON.stringify( { ok: false } ),
					{ status: 400, headers: { "Content-Type": "application/json" } }
				)
			)
		);

		const showToast = jest.fn();
		const setUser = jest.fn();
		const setIsLoggedIn = jest.fn();
		const mockUser: User = {
			userId: "1",
			username: "testuser",
			email: "testuser@example.com",
			dateJoined: "2022-01-01",
			accessToken: ""
		};

		render(
			<Router>
				<AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn }}>
					<UserContext.Provider value={{ user: mockUser, setUser: setUser }}>
						<ToastContext.Provider value={{ showToast }}>
							<DeleteAccount />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		const deleteButton = screen.getByRole( "button", { name: /Delete Account/i } );
		fireEvent.click( deleteButton );

		await waitFor( () => expect( global.fetch ).toHaveBeenCalledTimes( 1 ) );

		expect( global.fetch ).toHaveBeenCalledWith( `${ process.env.REACT_APP_API_URL }/users/testuser`, { method: "DELETE", headers: {"Authorization": "Bearer "} } );

		expect( setIsLoggedIn ).not.toHaveBeenCalled();
		expect( setUser ).not.toHaveBeenCalled();
		expect( showToast ).toHaveBeenCalledWith( "Error deleting user", "error" );
	} );

	it( "shows toast on fetch/network error", async () => {
		global.fetch = jest.fn( () => Promise.reject( new Error( "Network error" ) ) );
		const showToast = jest.fn();
		const setUser = jest.fn();
		const setIsLoggedIn = jest.fn();
		const mockUser: User = {
			userId: "1",
			username: "testuser",
			email: "testuser@example.com",
			dateJoined: "2022-01-01",
			accessToken: ""
		};

		render(
			<Router>
				<AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn }}>
					<UserContext.Provider value={{ user: mockUser, setUser: setUser }}>
						<ToastContext.Provider value={{ showToast }}>
							<DeleteAccount />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);
		fireEvent.click( screen.getByRole( "button", { name: /Delete Account/i } ) );
		await waitFor( () => {
			expect( showToast ).toHaveBeenCalledWith( "Error connecting to db", "error" );
		} );
	} );
} );