import axios from "axios";
import SignUp from "./SignUp";
import { useState } from "react";

const SignIn = ( props ) => {
	const [ signUp, setShowSignUp ] = useState( false );
	const [ loginError, setLoginError ] = useState( "" );
	const { user, setUser } = props;

	const handleSignUp = event => {
		setShowSignUp( true );
	};

	const handleLogIn = ( userData) => {
		const user = {
			userName: userData.userName,
			userPass: userData.userPass,
			userStatus: userData.userStatus,
			userBudget: userData.userBudget,
			userID: userData._id
		};
		setUser( user );
		localStorage.setItem( 'user', JSON.stringify( user ) );
	};

	const showErrorMsg = event => {
		setLoginError( event );
	};

	const handleSubmit = ( event ) => {
		event.preventDefault();

		const formData = event.currentTarget.elements;
		const body = {
			userName: formData.username.value,
			userPass: formData.password.value,
		}

		axios( {
			method: "post",
			url: "http://localhost:8000/log",
			data: body,
			headers: { "Content-Type": "application/json" },
		} )
			.then( function ( response ) {
				if ( response.data.success ) {
					handleLogIn( response.data.user);
				} else {
					showErrorMsg( response.data.message );
				}

				console.log( response );
			} )
			.catch( function ( response ) {
				//handle error
				console.log( response );
			} );
	};

	return (
		<>
			{ signUp ?
				<SignUp signUp={ signUp } setShowSignUp={ setShowSignUp }/>
				:
				<div className="login-form">
					<form onSubmit={ handleSubmit } encType="multipart/form-data">
						<p className="title">Sign In</p>
						<input type="text" name="username" className="form-control" placeholder="Username"/>
						<input type="password" name="password" className="form-control" placeholder="Password"/>
						<button type="submit">Login</button>
					</form>
					<div className="login-error">
						{ loginError }
					</div>
					<button onClick={ handleSignUp }>
						Not registered? SignUp here
					</button>
				</div>
			}
		</>
	);
};

export default SignIn;
