import axios from "axios";

const SignUp = ( props ) => {
	const { signUp, setShowSignUp } = props;
	
	const handleSubmit = ( event ) => {
		event.preventDefault();
		const formData = event.currentTarget.elements;
		const body = {
			userName: formData.username.value,
			userPass: formData.password.value,
			userStatus: formData.status.value,
		}

		axios( {
			method: "post",
			url: "http://localhost:8000/signup",
			data: body,
			headers: { "Content-Type": "application/json" },
		} )
			.then( function ( response ) {
				setShowSignUp( false );
			} )
			.catch( function ( response ) {
				//handle error
				console.log( response );
			} );
	};

	const backToLogin = () =>{
		setShowSignUp( false );
	}

	return (
		<>
			<div className="signup-form">
				<form onSubmit={ handleSubmit } encType="multipart/form-data">
					<p className="title">Sign Up</p>
					<input type="text" name="username" className="form-control" placeholder="Username"/>
					<input type="password" name="password" className="form-control" placeholder="Password"/>
					<div className="radio">
						<label> <input type="radio" name="status" value="buyer" defaultChecked/> Buyer/Seller </label>
					</div>
					<div className="radio">
						<label> <input type="radio" name="status" value="guest"/> Guest </label>
					</div>
					<button type="submit">Register</button>
				</form>
				<p className="p-link" onClick={backToLogin}>Back To Login</p>
			</div>
		</>
	);
};

export default SignUp;
