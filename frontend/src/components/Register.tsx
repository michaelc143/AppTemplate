import React from "react";
import UserLib from "../helpers/Lib_User";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import { ToastContext } from "../contexts/ToastContext";
import { UserContext } from "../contexts/UserContext";
import { AuthResponse } from "../interfaces/APIResponseInterfaces";
import { User } from "../interfaces/Interfaces";

export default function Register(): React.JSX.Element {
	const [ username, setUsername ] = useState<string>( "" );
	const [ email, setEmail ] = useState<string>( "" );
	const [ password, setPassword ] = useState<string>( "" );
	const [ bio, setBio ] = useState<string>( "" );
	const { setIsLoggedIn } = useContext( AuthContext );
	const { showToast } = useContext( ToastContext );
	const { setUser } = useContext( UserContext );
	const navigate = useNavigate();

	const checkRegistrationData = ( username: string, email: string, password: string ) => {

		if ( !UserLib.isValidUsername( username ) ) {
			showToast( "Username must be 3-20 characters long and can only contain letters, numbers, and underscores.", "error" );
			return false;
		}
		if ( !UserLib.isValidPassword( password ) ) {
			showToast( "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.", "error" );
			return false;
		}
		if ( !UserLib.isValidEmail( email ) ) {
			showToast( "Invalid email format.", "error" );
			return false;
		}
		return true;
	};

	const handleSubmit = async ( event: React.FormEvent ) => {
		event.preventDefault();

		if ( !username || !email || !password ) {
			showToast( "Please fill out all fields.", "error" );
			return;
		}

		if ( !checkRegistrationData( username, email, password ) ) {
			return;
		}

		try {
			const response = await fetch( `${ process.env.REACT_APP_API_URL }/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify( {
					username: username,
					email: email,
					password: password,
					bio: bio
				} )
			} );

			const data: AuthResponse = await response.json();

			if ( response.ok ) {
				setIsLoggedIn( true );
				setUser( {
					username: data.username,
					email: data.email,
					dateJoined: data.date_joined,
					bio: data.bio,
					accessToken: data.access_token
				} as User );
				showToast( "Registered successfully!", "success" );
				navigate( "/userinfo" );
			} 
			else {
				showToast( "Failed to register", "error" );
			}
		}
		catch ( error ) {
			showToast( "Error connecting to db", "error" );
		}
	};

	return (
		<div className="my-16 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register</h2>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit} role="form">
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="username" className="sr-only">Username</label>
							<input id="username" name="username" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Username" value={username} onChange={( e ) => setUsername( e.target.value )} />
						</div>
						<div>
							<label htmlFor="email" className="sr-only">Email</label>
							<input id="email" name="email" type="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email" value={email} onChange={( e ) => setEmail( e.target.value )} />
						</div>
						<div>
							<label htmlFor="password" className="sr-only">Password</label>
							<input id="password" name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" value={password} onChange={( e ) => setPassword( e.target.value )} />
						</div>
						<div>
							<label htmlFor="bio" className="sr-only">Bio</label>
							<input id="bio" name="bio" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Bio" value={bio} onChange={( e ) => setBio( e.target.value )} />
						</div>
					</div>
					<div>
						<button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Register</button>
					</div>
				</form>
				<div className="mt-6 flex justify-between">
					<Link to="/" className="text-blue-500 hover:text-blue-500">
            Back to Home
					</Link>
					<Link to="/login" className="text-blue-500 hover:text-blue-500">
            Login
					</Link>
				</div>
			</div>
		</div>
	);
}