	const mongoose = require('mongoose')

	const productSchema = new mongoose.Schema({
		productname: {
			type: String,
			required: [true, 'Please enter product namee'],
			trim: true,
		},
		description: {
			type: String,
			required: [true, 'Please enter product descriptionnnn'],
		},
		categoryname: {
			type: mongoose.Schema.ObjectId,
			ref: 'categories',
			required: [true, 'Please enter product categoryyy'],
		},
		// categoryname: {
		// 	type: String,
		// 	// ref: 'Category',
		// 	required: [true, 'Please enter product category'],
		// },
		mrp: {
			type: Number,
			required: [true, 'Please enter product MRP'],
			min: 0,
		},
		price: {
			type: Number,
			required: [true, 'Please enter product price'],
			min: 0,
		},
		stock: {
			type: Number,
			required: [true, 'Please enter product stock'],
			maxlength: [15, 'Stock cannot exceed limit'],
			default: 1,
			min: 0,
		},
		//image: [{ type: String, required: true }],image: [{ type: Array, required: true }],
		image: [{ type: String, required: true }],
		avgRating: {
			type: Number,
			default: 4.3,
		},
		numOfReviews: {
			type: Number,
			default: 12,
		},
		reviews: [
			{
				user: {
					type: mongoose.Schema.ObjectId,
					ref: 'users',
					required: true,
				},
				name: {
					type: String,
					required: true,
				},
				rating: {
					type: Number,
					min: 1,
					max: 5,
					required: true,
				},
				comment: {
					type: String,
				},
			},
		],
		status: {
			type: String,
			enum: ['Listed', 'Delisted'],
			required: true,
			default:'Listed'
		},
		offer: {
			type: {
				discountPercentage: Number,
				specialConditions: String,
			},
			default: null,
		}		
	});



	module.exports = mongoose.model('products', productSchema, 'products')