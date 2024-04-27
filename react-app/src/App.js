import React, { useEffect, useState } from "react";
import LandsMap from "./components/LandsMap";
import Login from "./components/SignIn";
import MapLegend from "./components/MapLegend";
import axios from "axios";

const App = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const loggedInUser = localStorage.getItem("user");
		if (loggedInUser) {
			const foundUser = JSON.parse(loggedInUser);
			setUser(foundUser);
		}
	}, []);

	useEffect(() => {
		const lands = localStorage.getItem("lands");
		if (!lands) {
			axios( {
				method: "post",
				url: "http://localhost:8000/init",
				data: { },
				headers: { "Content-Type": "application/json" },
			} )
				.then( function ( response ) {
					if ( response.data.success ) {
						localStorage.setItem( 'lands', JSON.stringify( response.data.lands ) );
					}
					console.log(response);
				} )
				.catch( function ( response ) {
					//handle error
					console.log( response );
				} );
		}
	}, []);

	const logOutUser = () => {
		localStorage.removeItem( 'user');
		setUser(null);
	}

	return (
		<>
			{
				user ?
					<>
						<div className="user-data">
							<span>Logged in as: {user.userName} | current budget: {user.userBudget}</span>
							<button onClick={logOutUser}>Logout?</button>
						</div>
						<div className="meta-centerland">
							<LandsMap user={user} setUser={setUser}/>
							<MapLegend/>
						</div>

					</>
					:
					<Login user={ user } setUser={ setUser } />
			}
		</>
	);
}

export default App;
