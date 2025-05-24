import React, { useEffect, useState, useContext } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";

import type { User } from "../interfaces/Interfaces";
import { UserContext } from "../contexts/UserContext";
import { ToastContext } from "../contexts/ToastContext";
import { AuthContext } from "../contexts/AuthContext";

function useQuery() {
	return new URLSearchParams( useLocation().search );
}

export default function UserSearchResults() {
	const query = useQuery().get( "q" ) || "";
	const [ results, setResults ] = useState<User[]>( [] );
	const [ loading, setLoading ] = useState( false );

	const { isLoggedIn } = useContext( AuthContext );
	const { user, setUser } = useContext( UserContext );
	const { showToast } = useContext( ToastContext );

	if ( !isLoggedIn ) {
		return <Navigate to="/" />;
	}

	useEffect( () => {
		if ( !query ) {
			setResults( [] );
			return;
		}
		setLoading( true );
		const apiUrl = process.env.REACT_APP_API_URL;
		if ( !apiUrl ) {
			showToast( "API URL is not configured.", "error" );
			setLoading( false );
			return;
		}

		fetch( `${ apiUrl }/users/search?q=${ encodeURIComponent( query ) }` )
			.then( res => {
				if ( !res.ok ) {
					throw new Error( `HTTP error! status: ${ res.status }` );
				}
				return res.json();
			} )
			.then( data => setResults( data.users || [] ) )
			.catch( error => {
				console.error( "Search fetch error:", error );
				showToast( "Failed to fetch search results.", "error" );
				setResults( [] );
			} )
			.finally( () => setLoading( false ) );
	}, [ query, showToast ] );

	const handleFollowToggle = async ( targetUsername: string, action: "follow" | "unfollow" ) => {
		if ( !user || !user.accessToken ) {
			showToast( `You must be logged in to ${ action } users.`, "error" );
			return;
		}

		const apiUrl = process.env.REACT_APP_API_URL;
		if ( !apiUrl ) {
			showToast( "API URL is not configured.", "error" );
			return;
		}

		try {
			const response = await fetch( `${ apiUrl }/users/${ targetUsername }/${ action }`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${ user.accessToken }`
				}
			} );
			const data = await response.json();
			if ( response.ok ) {
				showToast( data.message, "success" );
				setUser( { ...user, following: data.following } );
			} else {
				showToast( data.message, "error" );
			}
		} catch ( error ) {
			console.error( `${ action } error:`, error );
			showToast( "An error occurred. Please try again.", "error" );
		}
	};

	return (
		<div className="p-4 max-w-2xl mx-auto">
			<h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Search Results for &quot;{query}&quot;</h2>
			{loading && <div className="text-center text-gray-600 dark:text-gray-400 py-4">Loading...</div>}
			{!loading && results.length === 0 && query && (
				<div className="text-center text-gray-500 dark:text-gray-400 py-4">No users found matching &quot;{query}&quot;.</div>
			)}
			{!loading && !query && (
				<div className="text-center text-gray-500 dark:text-gray-400 py-4">Enter a search term to find users.</div>
			)}
			<ul className="space-y-4">
				{results.map( ( userResult: User ) => {
					const isFollowing = user?.following?.some(
						( followedUser ) => followedUser.username === userResult.username
					);
					const isCurrentUser = user?.username === userResult.username;

					console.log( JSON.stringify( userResult.username ) );

					return (
						<li key={userResult.username} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center transition-shadow duration-300 hover:shadow-xl">
							<div className="mb-4 sm:mb-0 text-center sm:text-left">
								<Link to={`/users/${ userResult.username }`} className="hover:underline">
									<h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{userResult.username}</h3>
								</Link>
								<p className="text-sm text-gray-600 dark:text-gray-400">{userResult.email}</p>
								{userResult.bio && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">&quot;{userResult.bio}&quot;</p>}
							</div>
							{user && !isCurrentUser && (
								<div className="flex-shrink-0 mt-4 sm:mt-0">
									<button
										onClick={() => handleFollowToggle( userResult.username, isFollowing ? "unfollow" : "follow" )}
										className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-colors duration-200 ${ isFollowing ? "bg-red-500 hover:bg-red-600 focus:ring-red-400" : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-400" }`}
									>
										{isFollowing ? "Unfollow" : "Follow"}
									</button>
								</div>
							)}
						</li>
					);
				} )}
			</ul>
		</div>
	);
}