import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, act } from "@testing-library/react";
import { AuthContext } from "../../contexts/AuthContext";
import DashboardList from "../Dashboard Components/DashboardList";

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
} );