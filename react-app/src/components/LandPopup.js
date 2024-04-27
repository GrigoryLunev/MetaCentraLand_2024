import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';
import axios from "axios";
import { useRef, useState } from "react";

const LandPopup = ( props ) => {
	const { openPopup, setOpenPopup } = props;
	const { landPrice, setLandPrice } = props;
	const { landForSale, setLandForSale } = props;
	const { showGame, setShowGame } = props;
	const { posX, posY } = props;
	const { owner, setLandOwner } = props;
	const { user, setUser } = props;
	const [ priceError, setPriceError ] = useState( "" );
	const [ serverMessage, setServerMessage ] = useState( "" );
	const [ showMessage, setShowMessage ] = useState( false );
	const currency = '$';
	const oldValueRef = useRef(0);
	if(landPrice != 0){
		oldValueRef.current = currency + landPrice.replace(currency,'');
	}

	const closeModal = () => {
		setShowMessage( false )
		setServerMessage( '' );
		setOpenPopup( false )
	};

	const showServerMsg = event => {
		setShowMessage( true )
		setServerMessage( event );
	};

	const handleSubmit = ( event ) => {
		event.preventDefault();
		const formData = event.currentTarget.elements;

		const body = {
			posX: parseInt( posX ),
			posY: parseInt( posY ),
			price: formData.landPrice.value.replace(currency,''),
			forSale: formData.landForSale.checked,
			showGame: formData.showGame.checked
		}

		axios( {
			method: "post",
			url: "http://localhost:8000/update-land-data",
			data: body,
			headers: { "Content-Type": "application/json" },
		} )
			.then( function ( response ) {
				if ( response.data.success ) {
					localStorage.setItem( 'lands', JSON.stringify( response.data.boardLands ) );
					setLandPrice( response.data.price );
					setLandForSale( response.data.forSale );
					showServerMsg('Land Updated Successfully!');
				} else {
					showServerMsg( response.data.message );
				}
				console.log( response );
			} )
			.catch( function ( response ) {
				//handle error
				console.log( response );
			} );
	}

	const handleSubmitBuy = ( event ) => {
		event.preventDefault();

		const body = {
			posX: parseInt( posX ),
			posY: parseInt( posY ),
			user: user.userID
		}

		axios( {
			method: "post",
			url: "http://localhost:8000/buy",
			data: body,
			headers: { "Content-Type": "application/json" },
		} )
			.then( function ( response ) {
				showServerMsg( response.data.message );
				setLandOwner( true );
				const user = {
					userName: response.data.user.userName,
					userPass: response.data.user.userPass,
					userStatus: response.data.user.userStatus,
					userBudget: response.data.user.userBudget,
					userID: response.data.user._id
				};
				setUser(user);
				localStorage.setItem( 'user', JSON.stringify( user ) );
				localStorage.setItem( 'lands', JSON.stringify( response.data.boardLands ) );
			} )
			.catch( function ( response ) {
				//handle error
				console.log( response );
			} );
	}

	const toggleChange = ( event ) => {
		setLandForSale( event.target.checked );
	}
	const toggleShowGameChange = ( event ) => {
		setShowGame( event.target.checked );
	}
	const onPriceChange = ( event ) => {
		setPriceError('');
		const numbers_only = /^[\d\b]+$/;
		const input = event.target.value;
		const priceInNumbers = input.replace(currency,'');

		if(priceInNumbers < 0 ){
			setPriceError('Price must be at least 1$!')
		}
		if(numbers_only.test(priceInNumbers) || priceInNumbers == ''){
			event.target.value = currency + priceInNumbers;
			setLandPrice( event.target.value );
			oldValueRef.current = event.target.value;
		} else{
			setLandPrice( oldValueRef.current );
		}
	}

	return (
		<Popup open={ openPopup } closeOnDocumentClick onClose={ closeModal }>
			<div className="popup-modal">
				<a className="close" onClick={ closeModal }>
					&times;
				</a>
				{ user.userStatus === 'buyer' ?
				<div className="popup-wrap">
					{ !showMessage ?
						<>
							{ owner &&
								<form onSubmit={ handleSubmit } encType="multipart/form-data">
									<p className="update-title">Update Land Data</p>
									<div className="update-content">
										<div className="popup-field">
											<label>Land Price:</label>
											<input type="text" name="landPrice" className="form-control" placeholder="LandPrice" value={ currency + landPrice.replace(currency,'') } onChange={ onPriceChange }/>
										</div>
										<div className="popup-field">
											<label>Land For Sale:</label>
											<input type="checkbox" name="landForSale" className="form-control" placeholder="LandForSale" checked={ landForSale } onChange={ toggleChange }/>
										</div>
										<div className="popup-field">
											<label>Show Numble Game</label>
											<input type="checkbox" name="showGame" className="form-control" placeholder="showGame" checked={ showGame } onChange={ toggleShowGameChange }/>
										</div>
										<button type="submit">Update</button>
									</div>
									{priceError && <p className="price-error">{priceError}</p>}
								</form>
							} {
							!owner && landForSale &&
							<form onSubmit={ handleSubmitBuy } encType="multipart/form-data">
								<p>Buy Land</p>
								<p>Land Price: <input type="text" name="landPrice" value={ landPrice } disabled/></p>
								<button type="submit">Buy</button>
							</form>
						} {
							!owner && !landForSale &&
							<p>This land is not for sale!</p>
						}
						</>
						:
						<p>{ serverMessage }</p>
					}
				</div>
					:
					<p className="guest-title">Hello Guest!</p>
			} { showGame &&
				<div className="numble-game">
					<a href="https://grigorylunev.github.io/HW2/" target="_blank">Start Numble Game</a>
				</div>
			}
				{ !showGame && user.userStatus === 'guest' &&
					<p>Nothing here...</p>
			}
			</div>
		</Popup>
	)
};

export default LandPopup;
