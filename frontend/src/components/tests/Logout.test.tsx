import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { fireEvent, render, screen, act, waitFor } from "@testing-library/react";

import { AuthContext } from "../../contexts/AuthContext";
import { UserContext } from "../../contexts/UserContext";
import { ToastContext } from "../../contexts/ToastContext";
import Logout from "../Logout";
import { User } from "../../interfaces/Interfaces";

describe( "Logout", () => {
	test( "renders logout button", () => {
		const setIsLoggedIn = jest.fn();
		const setUser = jest.fn();

		const mockUser: User = {
			userId: "1",
			username: "testuser",
			email: "testuser@example.com",
			dateJoined: "2022-01-01",
			accessToken: "mockAccessToken"
		};

		render(
			<Router>
				<AuthContext.Provider value={{ setIsLoggedIn, isLoggedIn: true }}>
					<UserContext.Provider value={{ user: mockUser, setUser: setUser }}>
						<Logout />
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		expect( screen.getByText( "Are you sure you want to logout?" ) ).toBeInTheDocument();
		expect( screen.getByText( "Logout" ) ).toBeInTheDocument();
	} );

	test( "does not render logout button when not logged in", () => {
		const setIsLoggedIn = jest.fn();
		const setUser = jest.fn();

		const mockUser: User = {
			userId: "1",
			username: "testuser",
			email: "testuser@example.com",
			dateJoined: "2022-01-01",
			accessToken: "mockAccessToken"
		};

		render(
			<Router>
				<AuthContext.Provider value={{ setIsLoggedIn, isLoggedIn: false }}>
					<UserContext.Provider value={{ user: mockUser, setUser: setUser }}>
						<Logout />
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		expect( screen.queryByText( "Logout" ) ).not.toBeInTheDocument();
		expect( screen.queryByText( "Are you sure you want to logout?" ) ).not.toBeInTheDocument();
	} );

	test( "calls logout function on button click", () => {
		const setIsLoggedIn = jest.fn();
		const setUser = jest.fn();

		const mockUser: User = {
			userId: "1",
			username: "testuser",
			email: "testuser@example.com",
			dateJoined: "2022-01-01",
			accessToken: "mockAccessToken"
		};

		render(
			<Router>
				<AuthContext.Provider value={{ setIsLoggedIn, isLoggedIn: true }}>
					<UserContext.Provider value={{ user: mockUser, setUser: setUser }}>
						<Logout />
					</UserContext.Provider>
				</AuthContext.Provider>
			</Router>
		);

		fireEvent.click( screen.getByText( "Logout" ) );

		expect( setIsLoggedIn ).toHaveBeenCalledWith( false );
		expect( setUser ).toHaveBeenCalledWith( {
			userId: "",
			username: "",
			email: "",
			dateJoined: "",
			accessToken: ""
		} );
		expect( window.location.pathname ).toBe( "/" );
	} );
} );