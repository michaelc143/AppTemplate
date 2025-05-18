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
		expect( global.fetch ).toHaveBeenCalledWith( `${ process.env.REACT_APP_API_URL }/register`, {
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
	
	test( "shows error toast when registration fails from bad username", async () => {
		const setIsLoggedIn = jest.fn();
		const setUser = jest.fn();
		const showToast = jest.fn();
		
		render(
			<Router>
				<AuthContext.Provider value={{ isLoggedIn: false, setIsLoggedIn }}>
					<UserContext.Provider value={{user: {
						userId: "",
						username: "",
						email: "",
						dateJoined: "",
						accessToken: ""
					}, setUser}}>
						<ToastContext.Provider value={{ showToast }}>
							<Register />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		fireEvent.change( screen.getByLabelText( /username/i ), {
			target: { value: "t" }
		} );
		fireEvent.change( screen.getByLabelText( /email/i ), {
			target: {
				value: "testuser@example.com"
			}
		} );	
		fireEvent.change( screen.getByLabelText( /password/i ), {
			target: { value: "Testpassword!1" }
		} );
		fireEvent.click( screen.getByRole( "button", { name: /Register/i } ) );
		await waitFor( () => expect( global.fetch ).toHaveBeenCalledTimes( 0 ) );
		expect( setIsLoggedIn ).not.toHaveBeenCalled();
		expect( setUser ).not.toHaveBeenCalled();
		expect( showToast ).toHaveBeenCalledWith( "Username must be 3-20 characters long and can only contain letters, numbers, and underscores.", "error" );
		expect( mockNavigate ).not.toHaveBeenCalled();
	} );
	
	test( "shows error toast when registration fails from bad email", async () => {
		const setIsLoggedIn = jest.fn();
		const setUser = jest.fn();
		const showToast = jest.fn();
		
		render(
			<Router>
				<AuthContext.Provider value={{ isLoggedIn: false, setIsLoggedIn }}>
					<UserContext.Provider value={{user: {
						userId: "",
						username: "",
						email: "",
						dateJoined: "",
						accessToken: ""
					}, setUser}}>
						<ToastContext.Provider value={{ showToast }}>
							<Register />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		fireEvent.change( screen.getByLabelText( /username/i ), {
			target: { value: "testUser" }
		} );
		fireEvent.change( screen.getByLabelText( /email/i ), {
			target: {
				value: "t"
			}
		} );	
		fireEvent.change( screen.getByLabelText( /password/i ), {
			target: { value: "Testpassword!1" }
		} );
		fireEvent.click( screen.getByRole( "button", { name: /Register/i } ) );
		await waitFor( () => expect( global.fetch ).toHaveBeenCalledTimes( 0 ) );
		expect( setIsLoggedIn ).not.toHaveBeenCalled();
		expect( setUser ).not.toHaveBeenCalled();
		expect( showToast ).toHaveBeenCalledWith( "Invalid email format.", "error" );
		expect( mockNavigate ).not.toHaveBeenCalled();
	} );
	
	test( "shows error toast when registration fails from bad password", async () => {
		const setIsLoggedIn = jest.fn();
		const setUser = jest.fn();
		const showToast = jest.fn();
		
		render(
			<Router>
				<AuthContext.Provider value={{ isLoggedIn: false, setIsLoggedIn }}>
					<UserContext.Provider value={{user: {
						userId: "",
						username: "",
						email: "",
						dateJoined: "",
						accessToken: ""
					}, setUser}}>
						<ToastContext.Provider value={{ showToast }}>
							<Register />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		fireEvent.change( screen.getByLabelText( /username/i ), {
			target: { value: "testUser" }
		} );
		fireEvent.change( screen.getByLabelText( /email/i ), {
			target: {
				value: "testuser@gmail.com"
			}
		} );	
		fireEvent.change( screen.getByLabelText( /password/i ), {
			target: { value: "t" }
		} );
		fireEvent.click( screen.getByRole( "button", { name: /Register/i } ) );
		await waitFor( () => expect( global.fetch ).toHaveBeenCalledTimes( 0 ) );
		expect( setIsLoggedIn ).not.toHaveBeenCalled();
		expect( setUser ).not.toHaveBeenCalled();
		expect( showToast ).toHaveBeenCalledWith( "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.", "error" );
		expect( mockNavigate ).not.toHaveBeenCalled();
	} );
	
	test( "shows error toast when registration fails from no username", async () => {
		const setIsLoggedIn = jest.fn();
		const setUser = jest.fn();
		const showToast = jest.fn();
		
		render(
			<Router>
				<AuthContext.Provider value={{ isLoggedIn: false, setIsLoggedIn }}>
					<UserContext.Provider value={{user: {
						userId: "",
						username: "",
						email: "",
						dateJoined: "",
						accessToken: ""
					}, setUser}}>
						<ToastContext.Provider value={{ showToast }}>
							<Register />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		fireEvent.change( screen.getByLabelText( /email/i ), {
			target: {
				value: "testuser@gmail.com"
			}
		} );	
		fireEvent.change( screen.getByLabelText( /password/i ), {
			target: { value: "TestPassword1!" }
		} );
		fireEvent.click( screen.getByRole( "button", { name: /Register/i } ) );
		await waitFor( () => expect( global.fetch ).toHaveBeenCalledTimes( 0 ) );
		expect( setIsLoggedIn ).not.toHaveBeenCalled();
		expect( setUser ).not.toHaveBeenCalled();
		expect( showToast ).toHaveBeenCalledWith( "Please fill out all fields.", "error" );
		expect( mockNavigate ).not.toHaveBeenCalled();
	} );
} );

describe( "Register error handling", () => {
	const setIsLoggedIn = jest.fn();
	const setUser = jest.fn();
	const showToast = jest.fn();

	const setup = () => {
		render(
			<Router>
				<AuthContext.Provider value={{ isLoggedIn: false, setIsLoggedIn }}>
					<UserContext.Provider value={{user: {
						userId: "",
						username: "",
						email: "",
						dateJoined: "",
						accessToken: ""
					},
					setUser: setUser }}>
						<ToastContext.Provider value={{ showToast }}>
							<Register />
						</ToastContext.Provider>
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);
		fireEvent.change( screen.getByPlaceholderText( /Username/i ), { target: { value: "testuser" } } );
		fireEvent.change( screen.getByPlaceholderText( /Email/i ), { target: { value: "test@example.com" } } );
		fireEvent.change( screen.getByPlaceholderText( /Password/i ), { target: { value: "Password1!" } } );
	};

	it( "shows toast on failed registration (API error)", async () => {
		global.fetch = jest.fn( () =>
			Promise.resolve(
				new Response(
					JSON.stringify( { message: "Username/Email already taken" } ),
					{ status: 401, headers: { "Content-Type": "application/json" } }
				)
			)
		);
		setup();
		fireEvent.click( screen.getByRole( "button", { name: /register/i } ) );
		await waitFor( () => {
			expect( showToast ).toHaveBeenCalledWith( "Failed to register", "error" );
		} );
	} );

	it( "shows toast on fetch/network error", async () => {
		global.fetch = jest.fn( () => Promise.reject( new Error( "Network error" ) ) );
		setup();
		fireEvent.click( screen.getByRole( "button", { name: /register/i } ) );
		await waitFor( () => {
			expect( showToast ).toHaveBeenCalledWith( "Error connecting to db", "error" );
		} );
	} );
} );