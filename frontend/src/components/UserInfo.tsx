import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { Navigate, Link } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import { UserContext } from "../contexts/UserContext";

export default function UserInfo(): React.JSX.Element {

	const { isLoggedIn } = useContext( AuthContext );
	const { user } = useContext( UserContext );
	
	if ( !isLoggedIn ) {
		return <Navigate to="/" />;
	}

	const [ followers, setFollowers ] = useState<string[]>( [] );
	const [ following, setFollowing ] = useState<string[]>( [] );

	useEffect( () => {
		const fetchFollowers = async () => {
			const response = await fetch( `${ process.env.REACT_APP_API_URL }/users/${ user.username }/followers` );
			const data = await response.json();

			if ( !response.ok ) {
				console.error( "Error fetching following data:", data );
				return;
			}

			setFollowers( data.followers.map( ( follower: { username: string } ) => follower.username ) );
		};

		const fetchFollowing = async () => {
			const response = await fetch( `${ process.env.REACT_APP_API_URL }/users/${ user.username }/following` );
			const data = await response.json();

			if ( !response.ok ) {
				console.error( "Error fetching following data:", data );
				return;
			}

			setFollowing( data.following.map( ( followed: { username: string } ) => followed.username ) );
		};

		fetchFollowers();
		fetchFollowing();
	}, [ user.username ] );

	if ( !isLoggedIn ) {
		return <Navigate to="/" />;
	}

	return (
		<div className="border-l-2 border-slate-500 flex flex-col items-center justify-center my-16 bg-slate-500 pt-8 pb-8 max-w-2xl w-full mx-auto rounded-lg shadow-lg">
			<div className="mb-8 font-bold text-4xl text-white">User Info</div>
			<div className="text-2xl text-white">Username: {user.username}</div>
			<div className="text-2xl text-white">Email: {user.email}</div>
			<div className="text-2xl text-white">Date Joined: {user.dateJoined}</div>
			{user.bio && <div className="text-2xl text-white">Bio: {user.bio}</div>}
			<div className="text-2xl text-white">Followers: {followers.length}</div>
			<ul className="text-white">
				{followers.length !== 0 && followers.map( ( follower ) => (
					<li key={follower}>{follower}</li>
				) )}
			</ul>
			<div className="text-2xl text-white">Following: {following.length}</div>
			<ul className="text-white">
				{following.length !== 0 && following.map( ( followed ) => (
					<li key={followed}>{followed}</li>
				) )}
			</ul>
			<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-4">
				<Link to="/editprofile"> Edit Profile</Link>
			</button>
			<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
				<Link to="/deleteaccount">Delete Account</Link>
			</button>
		</div>
	);
}
