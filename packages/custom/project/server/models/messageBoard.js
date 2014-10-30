'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
* Message Schema
*/

var messageSchema = new Schema ({
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required: true
	},
	body: {
		type: String,
		required: true
	},
	timeSent: {
		type: Date,
		default: Date.now,
		required: true
	}
});

mongoose.model('Message', messageSchema);