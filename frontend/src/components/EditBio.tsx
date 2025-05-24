import React from "react";
import { useContext } from "react";
import { Navigate, Link } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import { UserContext } from "../contexts/UserContext";
import { ToastContext } from "../contexts/ToastContext";

export default function EditBio(): React.JSX.Element {

	const { isLoggedIn } = useContext( AuthContext );
	const { user, setUser } = useContext( UserContext );
	const { showToast } = useContext( ToastContext );
	const [ newBio, setNewBio ] = React.useState<string>( "" );

	if ( !isLoggedIn ) {
		return <Navigate to="/" />;
	}

	/**
	 * @description: Handle change bio
	 * @param {string} newBio Bio to be used for the user
	 * @return {void}
	 */
	const handleChangeBio = async () => {
		if ( !isLoggedIn || !user ) {
			showToast( "You must be logged in to change your bio", "error" );
			return;
		}

		if ( !newBio ) {
			showToast( "Please enter a bio", "error" );
			return;
		}
		try {
			const response = await fetch( `${ process.env.REACT_APP_API_URL }/users/${ user.username }/bio`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${ user.accessToken }`
				},
				body: JSON.stringify( {
					bio: newBio
				} )
			} );

			switch ( response.status ) {
				case 200 :
					showToast( "Bio changed successfully!", "success" );
					setNewBio( "" );
					setUser( { ...user, bio: newBio } );
					break;
				case 400 :
					showToast( "Bad request. Please check your input.", "error" );
					break;
				case 403 :
					showToast( "Unauthorized. Please log in again.", "error" );
					break;
				case 404 :
					showToast( "User not found. Please check your username.", "error" );
					break;
				case 500 :
					showToast( "Server error. Please try again later.", "error" );
					break;
				default :
					showToast( "An unexpected error occurred. Please try again.", "error" );
					break;
			}

		}
		catch ( error ) {
			showToast( "Error connecting to db", "error" );
		}
	};

	/**
	 * @description: Handle delete bio
	 * @return {void}
	 */
	const handleDeleteBio = async () => {
		if ( !isLoggedIn || !user ) {
			showToast( "You must be logged in to delete your bio", "error" );
			return;
		}

		// Add confirmation dialog
		if ( window.confirm( "Are you sure you want to delete your bio?" ) ) {
			try {
				const response = await fetch( `${ process.env.REACT_APP_API_URL }/users/${ user.username }/bio`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${ user.accessToken }`
					}
				} );

				switch ( response.status ) {
					case 200 :
						showToast( "Bio deleted successfully!", "success" );
						setNewBio( "" );
						setUser( { ...user, bio: "" } );
						break;
					case 403 :
						showToast( "Unauthorized. Please log in again.", "error" );
						break;
					case 404 :
						showToast( "User not found. Please check your username.", "error" );
						break;
					case 500 :
						showToast( "Server error. Please try again later.", "error" );
						break;
					default :
						showToast( "An unexpected error occurred. Please try again.", "error" );
						break;
				}

			}
			catch ( error ) {
				showToast( "Error connecting to db", "error" );
			}
		}
	};

	return (
		<div className="flex flex-col items-center justify-center my-16 dark:bg-neutral-900 pt-8 pb-8 max-w-3xl w-full mx-auto rounded-lg shadow-lg">
		
			<div className="mb-8 font-bold text-4xl text-white">Edit Bio</div>
			<div className="text-2xl text-white mb-4">Current Bio: {user.bio}</div>
			<div className="text-2xl text-white mb-4 flex items-center justify-center space-x-4">
				<label htmlFor="usernameInput" className="text-white">
							New bio:
				</label>
				<input
					id="usernameInput"
					data-testid="usernameInput"
					type="text"
					value={newBio}
					onChange={( e ) => setNewBio( e.target.value )}
					className="bg-gray-200 text-gray-700 border border-gray-300 rounded-lg py-2 px-2 placeholder: text-center"
					placeholder="Enter new username"
				/>
				<button onClick={handleChangeBio} className="bg-gray-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Change Bio</button>
			</div>
			<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={handleDeleteBio}>
				Delete Bio
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
