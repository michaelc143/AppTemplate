import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import { UserContext } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";

export default function Logout(): React.JSX.Element {

	const { isLoggedIn, setIsLoggedIn } = useContext( AuthContext );
	const { setUser } = useContext( UserContext );
	const navigate = useNavigate();

	if ( !isLoggedIn ) {
		return <Navigate to="/" />;
	}

	const logout = () => {
		setIsLoggedIn( false );
		setUser( {
			userId: "",
			username: "",
			email: "",
			dateJoined: "",
			accessToken: ""
		} );
		navigate( "/" );
	};

	return (
		<div className="flex flex-col items-center justify-center my-16">
			<h1 className="mb-8 font-bold text-4xl">Are you sure you want to logout?</h1>
			<button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
		</div>
	);
}