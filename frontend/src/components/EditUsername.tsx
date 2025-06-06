import React from "react";
import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import { UserContext } from "../contexts/UserContext";
import { ToastContext } from "../contexts/ToastContext";

export default function EditUsername(): React.JSX.Element {

	const { isLoggedIn } = useContext( AuthContext );
	const { user, setUser } = useContext( UserContext );
	const { showToast } = useContext( ToastContext );
	
	const [ newUsername, setNewUsername ] = useState<string>( "" );

	if ( !isLoggedIn ) {
		return <Navigate to="/" />;
	}

	/**
	 * @description: Handle change username
	 * @param {string} newUsername
	 * @return {void}
	 */
	const handleChangeUsername = async () => {
		if ( !isLoggedIn || !user ) {
			showToast( "You must be logged in to change your username", "error" );
			return;
		}

		if ( !newUsername ) {
			showToast( "Please enter a username", "error" );
			return;
		}
		try {
			const response = await fetch( `${ process.env.REACT_APP_API_URL }/users/${ user.username }/username`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${ user.accessToken }`
				},
				body: JSON.stringify( {
					newUsername: newUsername
				} )
			} );

			if ( response.ok ) {
				showToast( "Username changed successfully!", "success" );
				// Parse the JSON response
				const data = await response.json(); 
				// Update access token
				const updatedUser = { ...user, username: newUsername, accessToken: data.access_token }; 
				setNewUsername( "" );
				// Clear the input field after updating
				setUser( updatedUser );
			} 
			else {
				showToast( "Failed to change username", "error" );
			}
		}
		catch ( error ) {
			showToast( "Error connecting to db", "error" );
		}
	};

	return (
		<div className="flex flex-col items-center justify-center my-16 dark:bg-neutral-900 pt-8 pb-8 max-w-3xl w-full mx-auto rounded-lg shadow-lg">

			<div className="mb-8 font-bold text-4xl text-white">Edit User</div>
			<div className="text-2xl text-white mb-4">Current Username: {user.username}</div>
			<div className="text-2xl text-white mb-4 flex items-center justify-center space-x-4">
				<label htmlFor="usernameInput" className="text-white">
					New Username:
				</label>
				<input
					id="usernameInput"
					data-testid="usernameInput"
					type="text"
					value={newUsername}
					onChange={( e ) => setNewUsername( e.target.value )}
					className="bg-gray-200 text-gray-700 border border-gray-300 rounded-lg py-2 px-2 placeholder: text-center"
					placeholder="Enter new username"
				/>
				<button onClick={handleChangeUsername} className="bg-gray-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Change Username</button>
			</div>
			<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
				<Link to="/deleteaccount">Delete Account</Link>
			</button>
			<button className="bg-sky-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
				<Link to="/editprofile">Return to Edit Profile</Link>
			</button>
			<button className="bg-sky-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
				<Link to="/dashboard">Return to Dashboard</Link>
			</button>
		</div>
	);
}
