import './LandsMap.css';
import LandPopup from "./LandPopup";
import { useState } from "react";

const LandsMap = ( props ) => {
	//Get board data from local storage
	const lands = localStorage.getItem( "lands" );
	let allLands;
	if ( lands ) {
		allLands = JSON.parse( lands );
	}
	const { user, setUser } = props;
	const [ openPopup, setOpenPopup ] = useState( false );
	const [ landPrice, setLandPrice ] = useState( 0 );
	const [ landForSale, setLandForSale ] = useState( '' );
	const [ showGame, setShowGame ] = useState( '' );
	const [ posX, setPosX ] = useState( 0 );
	const [ posY, setPosY ] = useState( 0 );
	const [ landOwner, setLandOwner ] = useState( false );

	const OnLandClick = async ( event ) => {
		if ( event.target.classList.contains( 'private' ) ) {
			setOpenPopup( true );
			setLandPrice( event.target.getAttribute( 'data-price' ) );
			setLandForSale( event.target.getAttribute( 'data-sale' ) === 'true' );
			setShowGame( event.target.getAttribute( 'data-numble' ) === 'true' );
			setPosX( event.target.getAttribute( 'data-x' ) );
			setPosY( event.target.getAttribute( 'data-y' ) );
			setLandOwner( event.target.getAttribute( 'data-owner' ) === 'true' );
		}
	}

	const GetLandPriceTag = ( price ) => {
		if ( price >= 15 && price <= 75 ) {
			return 'small-price';
		} else if ( price > 75 && price <= 125 ) {
			return 'medium-price';
		} else {
			return 'large-price';
		}
	}

	let rows = [];
	let cell = [];
	Object.values( allLands ).map( ( value, index ) => {
		let cellID = `cell${ value.posX }-${ value.posY }`;
		const landPriceTag = GetLandPriceTag( value.price );
		let owner = false;
		let landForSale = '';
		if ( value.forSale ) {
			landForSale = 'for-sale';
		}
		if ( value.owner === user.userID ) {
			owner = true;
		}
		cell.push(
			<td key={ cellID } id={ cellID } data-owner={ owner } data-x={ value.posX } data-y={ value.posY } data-price={ value.price } data-sale={ value.forSale } data-numble={ value.showGame } className={ "cell " + value.landType + " " + landPriceTag + " " + landForSale } onClick={ OnLandClick }></td> )
		if ( value.posY === 99 ) {
			let rowID = `row${ value.posX }`
			rows.push( <tr key={ value.posX } id={ rowID } className="row">{ cell }</tr> )
			cell = [];
		}
	} );

	return (
		<div className="LandBoard">
			<table>
				<tbody>
				{ rows }
				</tbody>
			</table>
			<LandPopup user={ user } setUser={setUser} openPopup={ openPopup } setOpenPopup={ setOpenPopup } landPrice={ landPrice } setLandPrice={ setLandPrice } landForSale={ landForSale } setLandForSale={ setLandForSale } showGame={ showGame } setShowGame={ setShowGame } posX={ posX } posY={ posY } owner={ landOwner } setLandOwner={ setLandOwner }/>
		</div>
	);
}

export default LandsMap;
