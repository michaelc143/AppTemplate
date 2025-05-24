import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar(): React.JSX.Element {

	const { isLoggedIn } = useContext( AuthContext );
	const [ userQuery, setUserQuery ] = React.useState<string>( "" );
	const navigate = useNavigate();
	
	const handleSearch = ( e: React.FormEvent ) => {
		e.preventDefault();
		if ( userQuery.trim() ) {
			navigate( `/search?q=${ encodeURIComponent( userQuery.trim() ) }` );
			setUserQuery( "" );
		}
	};

	if ( isLoggedIn ) {
		return (
			<header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-4 dark:bg-neutral-900">
				<nav className="flex justify-end bg-white border-gray-200 dark:bg-gray-900 w-full">
					<Link to="/" className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2">Home</Link>
					<form onSubmit={handleSearch} className="flex gap-2">
						<input
							type="text"
							value={userQuery}
							onChange={e => setUserQuery( e.target.value )}
							placeholder="Search users by username"
							className="border px-2 py-1 rounded"
						/>
						<button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Search</button>
					</form>
					<Link to="/dashboard" className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2">Dashboard</Link>
					<Link to="/logout" className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2">Logout</Link>
					<Link to="/deleteaccount" className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2">Delete Account</Link>
					<Link to="/userinfo" className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2">User Info</Link>
				</nav>
			</header>
		);
	}

	return (
		<header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-4 dark:bg-neutral-900">
			<nav className="flex justify-end bg-white border-gray-200 dark:bg-gray-900 w-full">
				<Link to="/" className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2">Home</Link>
				<Link to="/login" className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2">Login</Link>
				<Link to="/register" className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2">Register</Link>
			</nav>
		</header>
	);
}