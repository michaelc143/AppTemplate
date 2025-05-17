import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { render, screen } from "@testing-library/react";

import { AuthContext } from "../../../contexts/AuthContext";
import Dashboard from "../../Dashboard Components/Dashboard";

describe( "Dashboard", () => {
	test( "renders Dashboard when logged in", async () => {
		const setIsLoggedIn = jest.fn();

		render(
			<Router>
				<AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn: setIsLoggedIn }}>
					<Dashboard />
				</AuthContext.Provider>
			</Router>
		);

		// Use findByText to wait for the text to appear
		const mainFunctionsText = await screen.findByText( /Main functions/i );
		expect( mainFunctionsText ).toBeInTheDocument();
	
		const welcomeText = await screen.findByText( /Welcome to the app!/i );
		expect( welcomeText ).toBeInTheDocument();
	} );

	test( "redirects to home page when not logged in", () => {
		const setIsLoggedIn = jest.fn();

		render(
			<Router>
				<AuthContext.Provider value={{ isLoggedIn: false, setIsLoggedIn: setIsLoggedIn }}>
					<Dashboard />
				</AuthContext.Provider>
			</Router>
		);

		expect( window.location.pathname ).toBe( "/" );
	} );
} );
