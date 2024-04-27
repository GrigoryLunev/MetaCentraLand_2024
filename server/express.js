require( "dotenv" ).config();

const express = require( "express" );
const app = express();
const cors = require( 'cors' )
const mongoose = require( "mongoose" );
const bodyParser = require( "body-parser" );

app.use( bodyParser.json() )
//app.use(express.static(__dirname + "/public"));
app.use( bodyParser.urlencoded( { extended: true } ) )

mongoose.connect(
	process.env.DATABASE_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	function ( error ) {
	}
);
const db = mongoose.connection;
db.on( "error", ( error ) => console.error( error ) );
db.once( "open", () => console.log( "Connected to Database" ) );

app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded() );

const sitesRouter = require( "./routes/users" );
const User = require( "./models/user" );
app.use( "/", sitesRouter );

app.listen( 8000, () => console.log( "Server Started" ) );
