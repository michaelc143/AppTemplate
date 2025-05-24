import React, { useEffect, useState } from "react";
import { useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { ToastContext } from "../../contexts/ToastContext";
import type { User } from "../../interfaces/Interfaces";
import { FollowerProps } from "../../interfaces/Props";

export default function Follower( { username }: FollowerProps ): React.JSX.Element {
	const { isLoggedIn } = useContext( AuthContext );
	const { user } = useContext( UserContext );
	const { showToast } = useContext( ToastContext );
	const [ selectedUser, setSelectedUser ] = useState<User>( {
		userId: "",
		username: "",
		email: "",
		dateJoined: "",
		accessToken: ""
	} );

	useEffect( () => {
		const fetchUserData = async () => {
			const response = await fetch( `${ process.env.REACT_APP_API_URL }/users/${ username }`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			} );

			const data = await response.json();

			switch ( response.status ) {
				case 200 :
					setSelectedUser( {
						userId: data.user_id,
						username: data.username,
						email: data.email,
						dateJoined: data.date_joined
					} as User );
					break;
				case 404 :
					showToast( "User not found", "error" );
					break;
				case 500 :
					showToast( "Internal server error", "error" );
					break;
				default :
					showToast( "An unexpected error occurred", "error" );
					break;
			}
		};

		fetchUserData();
	}, [ username, user.accessToken, showToast ] );

	if ( !isLoggedIn ) {
		return <Navigate to="/" />;
	}

	return (
		<div>
			<h1>{selectedUser.username}</h1>
			<p>Email: {selectedUser.email}</p>
			<p>Date Joined: {selectedUser.dateJoined}</p>
		</div>
	);
}