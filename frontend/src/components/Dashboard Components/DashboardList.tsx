import React, { useEffect } from "react";
import { useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext";
import { UserContext } from "../../contexts/UserContext";
import { ToastContext } from "../../contexts/ToastContext";
import { Navigate } from "react-router-dom";

export default function DashboardList(): React.JSX.Element {

	const { isLoggedIn } = useContext( AuthContext );
	const { user } = useContext( UserContext );
	const { showToast } = useContext( ToastContext );
	
	const [ followers, setFollowers ] = React.useState<string[]>( [] );
	const [ following, setFollowing ] = React.useState<string[]>( [] );
	const [ isLoading, setIsLoading ] = React.useState<boolean>( true );
	
	useEffect( () => {
		const fetchFollowers = async () => {
			const response = await fetch( `${ process.env.REACT_APP_API_URL }/users/${ user.username }/followers` );
			const data = await response.json();

			switch ( response.status ) {
			case 200 :
				setFollowers( data.followers.map( ( follower: { username: string } ) => follower.username ) );
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
			const response = await fetch( `${ process.env.REACT_APP_API_URL }users/${ user.username }/following` );
			const data = await response.json();

			switch ( response.status ) {
			case 200 :
				setFollowing( data.following.map( ( followed: { username: string } ) => followed.username ) );					break;
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
								<li className="text-2xl">Followers: {followers.length}</li>
								{followers.map( ( follower, index ) => (
									<li key={index} className="text-xl">{follower}</li>
								) )}
							</ul>
							<ul className="text-white">
								<li className="text-2xl">Following: {following.length}</li>
								{following.map( ( followed, index ) => (
									<li key={index} className="text-xl">{followed}</li>
								) )}
							</ul>
						</div>
					</div>
				</div>
			)
	);
}
