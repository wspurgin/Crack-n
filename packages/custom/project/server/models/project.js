'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

/**
* Project Schema
*/
var projectSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	startDate: {
		type: Date,
		default: Date.now,
		required: true
	},
	endDate: {
		type: Date,
		required: false
	},
	phases: {
		type: Array
	},
	admin: {
		type: Schema.ObjectId,
		ref: 'User',
		//required: true
	},
	members: {
		type: Array
	},
	messages: { 
		type: Array
	}
});
		 

mongoose.model('Project', projectSchema);


