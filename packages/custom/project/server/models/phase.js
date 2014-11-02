'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
* Phase Schema
*/

var phaseSchema = new Schema ({
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
	tasks: {
		type: Array,
		default: []
	},
	portionCompleted: {
		type: Number,
		default: 0.0
	}
});

mongoose.model('Phase', phaseSchema);