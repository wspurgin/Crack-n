'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

//relationship = require("mongoose-relationship");

/**
* Project Schema
*/

var projectSchema = new Schema({
//UPDATE!!!!
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
		// type: Schema.ObjectId,
		// ref: 'User',
		type: String,
		required: true
	},
	members: {
		type: Array
	},
	messages: { 
		type: Array
	}
});
		 

mongoose.model('Project', projectSchema);


