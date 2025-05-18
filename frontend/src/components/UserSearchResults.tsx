import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import type { User } from "../interfaces/Interfaces";

function useQuery() {
	return new URLSearchParams( useLocation().search );
}

export default function UserSearchResults() {
	const query = useQuery().get( "q" ) || "";
	const [ results, setResults ] = useState<User[]>( [] );
	const [ loading, setLoading ] = useState( false );

	useEffect( () => {
		if ( !query ) {return;}
		setLoading( true );
		fetch( `${ process.env.REACT_APP_API_URL }/users/search?q=${ encodeURIComponent( query ) }` )
			.then( res => res.json() )
			.then( data => setResults( data.users || [] ) )
			.finally( () => setLoading( false ) );
	}, [ query ] );

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">Search Results for {query}</h2>
			{loading && <div>Loading...</div>}
			<ul>
				{results.map( user => (
					<li key={user.username} className="border-b py-2">
						<strong>{user.username}</strong> <span className="text-gray-500">{user.email}</span>
					</li>
				) )}
				{!loading && results.length === 0 && <li>No users found.</li>}
			</ul>
		</div>
	);
}