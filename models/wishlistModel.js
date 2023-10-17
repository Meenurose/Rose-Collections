const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'users',
	},
	items: [
		{
			product: {
				type: mongoose.Schema.ObjectId,
				ref: 'products',
				required: true,
			}
		},
	],
})

module.exports = mongoose.model('wishlists', wishlistSchema, 'wishlists')