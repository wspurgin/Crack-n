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
		default: false,
		required: true
	},
	description: {
		type: String, 
		required: false
	},
	assignedMembers: {
		type: Array,
		required: false
	},
	dueDates: {
		type: Date,
		default:Date.now,
		required: true
	}
});

mongoose.model('Task',taskSchema);