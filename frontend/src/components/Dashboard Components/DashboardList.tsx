import React, { useEffect } from "react";
import { useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext";
import { UserContext } from "../../contexts/UserContext";
import { ToastContext } from "../../contexts/ToastContext";
import { Navigate } from "react-router-dom";
import Follower from "./Follower";

export default function DashboardList(): React.JSX.Element {

	const { isLoggedIn } = useContext( AuthContext );
	const { user, setUser } = useContext( UserContext );
	const { showToast } = useContext( ToastContext );
	
	const [ isLoading, setIsLoading ] = React.useState<boolean>( true );
	
	useEffect( () => {
		const fetchFollowers = async () => {
			const response = await fetch( `${ process.env.REACT_APP_API_URL }/users/${ user.username }/followers` );
			const data = await response.json();

			switch ( response.status ) {
				case 200 :
					setUser( { ...user, followers: data.followers } );
					break;
				case 404 :
					showToast( "Not Found: The requested resource could not be found.", "error" );
					break;
				case 500 :
					showToast( "Internal Server Error: Please try again later.", "error" );
					break;
				default :
					showToast( "An unexpected error occurred.", "error" );
					break;
			}

			setIsLoading( false );
			return;
		};
		const fetchFollowing = async () => {
			const response = await fetch( `${ process.env.REACT_APP_API_URL }/users/${ user.username }/following` );
			const data = await response.json();

			switch ( response.status ) {
				case 200 :
					setUser( { ...user, following: data.following } );
					break;
				case 404 :
					showToast( "Not Found: The requested resource could not be found.", "error" );
					break;
				case 500 :
					showToast( "Internal Server Error: Please try again later.", "error" );
					break;
				default :
					showToast( "An unexpected error occurred.", "error" );
					break;
			}
	
			setIsLoading( false );
			return;
		};

		fetchFollowers();
		fetchFollowing();
	}, [ user.username ] );

	if ( !isLoggedIn ) {
		return <Navigate to="/" />;
	}

	return (
		isLoading
			?
			(
				<div className="flex items-center justify-center h-screen">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
				</div>
			)
			:
			(
				<div className="width-1/2 h-screen bg-slate-500 my-12 border-l-2 border-slate-500 rounded-lg">
					<div className="flex flex-col items-center justify-center my-12 py-8">
						<h3 className="mb-8 font-bold text-2xl">Main functions</h3>
						<div>
							<ul className="text-white">
								<li className="text-2xl">Followers: {user?.followers?.length}</li>
								{user?.followers?.map( ( follower, index ) => (
									<li key={index} className="text-xl">
										<Follower username={follower.username} />
									</li>
								) )}
							</ul>
							<ul className="text-white">
								<li className="text-2xl">Following: {user?.following?.length}</li>
								{user?.following?.map( ( followed, index ) => (
									<li key={index} className="text-xl">{followed.username}</li>
								) )}
							</ul>
						</div>
					</div>
				</div>
			)
	);
}
