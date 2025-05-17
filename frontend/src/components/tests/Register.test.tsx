import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastContext } from "../../contexts/ToastContext";
import { UserContext } from "../../contexts/UserContext";
import Register from "../Register";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock( "react-router-dom", () => ( {
	...jest.requireActual( "react-router-dom" ),
	useNavigate: () => mockNavigate
} ) );

afterEach( () => {
	jest.resetAllMocks();
} );

describe( "Register", () => {
	test( "renders Register form and allows typing", () => {
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
						<ToastContext.Provider value={{ showToast: jest.fn() }}>
							<Register />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		const usernameInput = screen.getByLabelText( /Username/i ) as HTMLInputElement;
		const emailInput = screen.getByLabelText( /Email/i ) as HTMLInputElement;
		const passwordInput = screen.getByLabelText( /Password/i ) as HTMLInputElement;

		fireEvent.change( usernameInput, { target: { value: "testuser" } } );
		fireEvent.change( emailInput, { target: { value: "testuser@example.com" } } );
		fireEvent.change( passwordInput, { target: { value: "testpassword" } } );

		expect( usernameInput.value ).toBe( "testuser" );
		expect( emailInput.value ).toBe( "testuser@example.com" );
		expect( passwordInput.value ).toBe( "testpassword" );
	} );

	it( "submits the form with username, email, and password", async () => {
		const setIsLoggedIn = jest.fn();
		const setUser = jest.fn();
		const showToast = jest.fn();

		const mockUser = {
			userId: "1",
			username: "",
			email: "",
			dateJoined: "",
			accessToken: ""
		};

		render(
			<Router>
				<AuthContext.Provider value={{ isLoggedIn: false, setIsLoggedIn }}>
					<UserContext.Provider value={{ user: mockUser, setUser }}>
						<ToastContext.Provider value={{ showToast }}>
							<Register />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		// Fill in the form
		fireEvent.change( screen.getByLabelText( /username/i ), {
			target: { value: "testuser" }
		} );
		fireEvent.change( screen.getByLabelText( /email/i ), {
			target: { value: "testuser@example.com" }
		} );
		fireEvent.change( screen.getByLabelText( /password/i ), {
			target: { value: "Testpassword!1" }
		} );

		// Verify form values
		const form = screen.getByRole( "form" );
		expect( form ).toBeInTheDocument();
		expect( form ).toHaveFormValues( {
			username: "testuser",
			email: "testuser@example.com",
			password: "Testpassword!1"
		} );

		// Submit the form
		fireEvent.submit( form );

		// Wait for the fetch call
		await waitFor( () => expect( global.fetch ).toHaveBeenCalledTimes( 1 ) );
    
		// Verify fetch was called with correct arguments
		expect( global.fetch ).toHaveBeenCalledWith( "http://localhost:5000/api/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify( {
				username: "testuser",
				email: "testuser@example.com",
				password: "Testpassword!1"
			} )
		} );

		// Verify state updates
		expect( setIsLoggedIn ).toHaveBeenCalledWith( true );
		expect( setUser ).toHaveBeenCalledWith( {
			username: "testuser",
			email: "testuser@example.com",
			dateJoined: "2022-01-01"
		} );
		expect( showToast ).toHaveBeenCalledWith( "Registered successfully!", "success" );
		expect( mockNavigate ).toHaveBeenCalledWith( "/userinfo" );
	} );
} );