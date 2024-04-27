const express = require( "express" );
const router = express.Router();
const path = require( "path" );
const User = require( "../models/user" );
const Land = require( "../models/land" );
const bcrypt = require( "bcrypt" );

const Roads = require( "../landData/Roads" );
const Parks = require( "../landData/Parks" );

router.get( '/', async ( req, res ) => {
	res.sendFile( path.join( __dirname, "../../react-app/public", "index.html" ) );
} )

// Creating user
router.post( '/signup', async ( req, res ) => {
	const budget = req.body.userStatus === 'buyer' ? 1000 : 0;
	//Salt password
	const salt = await bcrypt.genSalt();
	const hashPassword = await bcrypt.hash( req.body.userPass, salt );
	//Create user with salted password
	const user = new User( {
		userName: req.body.userName,
		userPass: hashPassword,
		userStatus: req.body.userStatus,
		userBudget: budget,
		userOwner: false
	} )

	try {
		await user.save()
		res.redirect( '/' )
	} catch ( err ) {
		res.status( 400 ).json( { message: err.message } )
	}
} )

// Login user
router.post( '/log', async ( req, res ) => {
	await getUser( req.body.userName, res );
	if ( null === res.user ) {
		res.status( 200 ).send( { success: false, message: "User " + req.body.userName + " not exist" } );
		return;
	}
	//Check password match
	const match = await bcrypt.compare( req.body.userPass, res.user.userPass );
	if ( !match ) {
		res.status( 200 ).send( { success: false, message: "Wrong Password!" } );
	} else {
		res.status( 200 ).send( { success: true, message: "Logged in!", user: res.user } );
	}
} )

async function getAllLands() {
	const lands = await Land.find();
	return lands;
}

router.post( '/buy', async ( req, res ) => {
	const positionX = req.body.posX;
	const positionY = req.body.posY;
	const userID = req.body.user;
	let land = await Land.findOne( { posX: positionX, posY: positionY } );

	const user = await User.findOne( { _id: userID } );

	if ( parseInt( user.userBudget ) < parseInt( land.price ) ) {
		res.status( 200 ).send( { success: false, message: "There is not enough budget." } );
	} else {

		//Update buyer budget
		const buyerNewBudget = parseInt( user.userBudget ) - parseInt( land.price );
		try {
			await User.updateOne(
				{ _id: user._id },
				{
					$set: {
						"userBudget": buyerNewBudget.toString(),
					}
				}
			)
		} catch ( err ) {
			console.log( err );
		}
		const owner = await User.findOne( { _id: land.owner } );
		const ownerNewBudget = parseInt( owner.userBudget ) + parseInt( land.price );
		//Update seller budget
		await User.updateOne(
			{ _id: owner._id },
			{
				$set: {
					"userBudget": ownerNewBudget.toString(),
				}
			}
		)

		//Update land new owner
		await Land.updateOne(
			{ _id: land._id },
			{
				$set: {
					"owner": user._id,
				}
			}
		)
		let allLands = await getAllLands();
		const updatedUser = await User.findOne( { _id: userID } );
		res.status( 200 ).send( { success: true, message: "This land is now yours!", boardLands: allLands, user: updatedUser } );
	}
} )

router.post( '/update-land-data', async ( req, res ) => {
	const positionX = req.body.posX;
	const positionY = req.body.posY;
	const forSale = req.body.forSale;
	const showGame = req.body.showGame;
	const price = req.body.price;

	let land = await Land.findOne( { posX: positionX, posY: positionY } );

	Land.updateOne(
		{ _id: land._id },
		{
			$set: {
				forSale: forSale,
				showGame: showGame,
				price: price,
			}
		},
		async function ( err, doc ) {
			if ( err ) {
				res.status( 200 ).send( { success: false, message: "Land Not Updated!" } );
			} else {
				let allLands = await getAllLands();
				res.status( 200 ).send( {
					success: true,
					message: "Land Updated!",
					boardLands: allLands,
					price: price,
					forSale: forSale,
					showGame: showGame
				} );
			}
		}
	);
} )

router.post( '/init', async ( req, res ) => {
	let allLands;
	Land.count( async function ( err, count ) {
		if ( !err && count === 0 ) {
			await populateLands();
		}
		allLands = await getAllLands();
		res.status( 200 ).send( { success: true, lands: allLands } );
	} );
} );

async function populateLands() {
	const mapWidth = 100;
	const mapHeight = 100;
	const ownerUser = await createOwnerUser();

	for ( let i = 0; i < mapWidth; i ++ ) {
		for ( let idx = 0; idx < mapHeight; idx ++ ) {
			let owner = - 1;
			let landForSale = false;
			let landPrice = 0;
			let landType = getLandType( i, idx );
			if ( landType === 'private' ) {
				owner = ownerUser;
				landForSale = IsLandForSale();
				landPrice = GetLandPrice();
			}
			await createNewLand( i, idx, owner, landType, landForSale, landPrice );
		}
	}
}

const getLandType = ( x, y ) => {
	if ( JSON.stringify( Roads ).includes( JSON.stringify( [ x, y ] ) ) ) {
		return 'road';
	} else if ( JSON.stringify( Parks ).includes( JSON.stringify( [ x, y ] ) ) ) {
		return 'park'
	} else {
		return 'private';
	}
}

const IsLandForSale = () => {
	return Math.random() < 0.5;
}

const GetLandPrice = () => {
	return Math.floor( Math.random() * ( 200 - 15 + 1 ) + 15 );
}

async function createNewLand( x, y, owner, landType, forSale, price ) {
	const land = new Land( {
		posX: x,
		posY: y,
		owner: owner,
		landType: landType,
		forSale: forSale,
		price: price,
		showGame: true,
	} )
	await land.save();
}

async function createOwnerUser() {
	const userName = 'G.Ltd';
	let findUser = await User.findOne( { userName: userName } );
	if ( null !== findUser ) {
		return findUser._id;
	}
	const salt = await bcrypt.genSalt();
	const ownerPassword = '1234';
	const hashPassword = await bcrypt.hash( ownerPassword, salt );
	const user = new User( {
		userName: userName,
		userPass: hashPassword,
		userStatus: 'buyer',
		userBudget: 1000,
		userOwner: true,
	} );

	await user.save();
	return user._id;
}

async function getUser( username, res ) {
	let user;
	try {
		user = await User.findOne( { userName: username } );
	} catch ( err ) {
		return res.status( 500 ).json( { message: err.message } );
	}
	res.user = user;
	return;
}

module.exports = router;
