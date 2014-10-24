'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

/**
* Tasks Schema
*/

var taskSchema = new Schema ({
	name: {
		type: String,
		required: true
	},
	completed: {
		type: Boolean,
		required: true
	},
	description: {
		type: String, 
		required: false
	},
	assignedMembers: {
		type: String,
		required: true
	},
	dueDates: {
		type: Date,
		required: true
	}
});

mongoose.model('Tasks',taskSchema);