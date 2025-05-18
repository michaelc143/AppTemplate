import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { fireEvent, render, screen, waitFor, act } from "@testing-library/react";

import { AuthContext } from "../../contexts/AuthContext";
import { ToastContext } from "../../contexts/ToastContext";
import { UserContext } from "../../contexts/UserContext";
import Login from "../Login";

describe( "Login", () => {
	it( "shows error toast on invalid credentials", async () => {
		const setIsLoggedIn = jest.fn();
		const setUser = jest.fn();
		const showToast = jest.fn();

		const mockUser = {
			userId: "1",
			username: "testuser",
			email: "testuser@example.com",
			dateJoined: "2022-01-01",
			accessToken: "mockAccessToken"
		};
		
		global.fetch = jest.fn( () =>
			Promise.resolve(
				new Response(
					JSON.stringify( { message: "Invalid credentials" } ),
					{ status: 401, headers: { "Content-Type": "application/json" } }
				)
			)
		);

		render(
			<Router>
				<AuthContext.Provider value={{ isLoggedIn: false, setIsLoggedIn }}>
					<UserContext.Provider value={{ user: mockUser, setUser }}>
						<ToastContext.Provider value={{ showToast }}>
							<Login />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		fireEvent.change( screen.getByLabelText( /Username/i ), { target: { value: "baduser" } } );
		fireEvent.change( screen.getByLabelText( /Password/i ), { target: { value: "badpass" } } );
		fireEvent.click( screen.getByRole( "button", { name: /login/i } ) );

		await waitFor( () => expect( showToast ).toHaveBeenCalledWith( "Error logging in", "error" ) );
	} );
	test( "renders Login form and allows typing", () => {
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
					<UserContext.Provider value={{ user: mockUser, setUser: setUser }}>
						<ToastContext.Provider value={{ showToast: jest.fn() }}>
							<Login />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		expect( screen.getByLabelText( /Username/i ) as HTMLInputElement ).toBeInTheDocument();
		expect( screen.getByLabelText( /Password/i ) as HTMLInputElement ).toBeInTheDocument();
	} );
	
	it( "redirects to dashboard if already logged in", async () => {
		const mockUser = {
			userId: "1",
			username: "testuser",
			email: "testuser@example.com",
			dateJoined: "2022-01-01",
			accessToken: "mockAccessToken"
		};

		await act( () => {
			render(
				<Router>
					<AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn: jest.fn() }}>
						<UserContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
							<ToastContext.Provider value={{ showToast: jest.fn() }}>
								<Login />
							</ToastContext.Provider>
						</UserContext.Provider>
					</AuthContext.Provider>
				</Router>
			);
		} );

		expect( window.location.pathname ).toBe( "/dashboard" );
	} );

	test( "Login form allows typing", () => {
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
					<UserContext.Provider value={{ user: mockUser, setUser: setUser }}>
						<ToastContext.Provider value={{ showToast: jest.fn() }}>
							<Login />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		const usernameInput = screen.getByLabelText( /Username/i ) as HTMLInputElement;
		const passwordInput = screen.getByLabelText( /Password/i ) as HTMLInputElement;

		fireEvent.change( usernameInput, { target: { value: "testuser" } } );
		fireEvent.change( passwordInput, { target: { value: "testpassword" } } );

		expect( usernameInput.value ).toBe( "testuser" );
		expect( passwordInput.value ).toBe( "testpassword" );
	} );

	it( "submits the form with username and password", async () => {
		const setIsLoggedIn = jest.fn();
		const setUser = jest.fn();

		// Mock the fetch API call
		global.fetch = jest.fn( () =>
			Promise.resolve(
				new Response( JSON.stringify( { success: true } ) )
			)
		);

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
					<UserContext.Provider value={{ user: mockUser, setUser: setUser }}>
						<ToastContext.Provider value={{ showToast: jest.fn() }}>
							<Login />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		const usernameInput = screen.getByLabelText( "Username" ) as HTMLInputElement;
		const passwordInput = screen.getByLabelText( "Password" ) as HTMLInputElement;
		const submitButton = screen.getByRole( "button", { name: /Login/i } ) as HTMLButtonElement;

		fireEvent.change( usernameInput, { target: { value: "testuser" } } );
		fireEvent.change( passwordInput, { target: { value: "testpassword" } } );
		fireEvent.click( submitButton );

		await waitFor( () => expect( global.fetch ).toHaveBeenCalledTimes( 1 ) );

		expect( global.fetch ).toHaveBeenCalledWith( `${ process.env.REACT_APP_API_URL }/login`,
			{"body": "{\"username\":\"testuser\",\"password\":\"testpassword\"}", "headers": {"Content-Type": "application/json"}, "method": "POST"} );

		expect( usernameInput.value ).toBe( "testuser" );
		expect( passwordInput.value ).toBe( "testpassword" );
	} );
} );