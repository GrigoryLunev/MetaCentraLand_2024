const mongoose = require('mongoose')
const landSchema = new mongoose.Schema({
	posX: {
		type: Number,
		required: true
	},
	posY: {
		type: Number,
		required: true
	},
	owner: {
		type: String,
		required: true
	},
	landType: {
		type: String,
		required: true
	},
	forSale: {
		type: Boolean,
		required: true
	},
	price: {
		type: String,
		required: true
	},
	showGame: {
		type: Boolean,
		required: true
	},
})

module.exports = mongoose.model('Land', landSchema)
