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
	startDate: {
		type: Date,
		default: Date.now,
		required: true
	},
	endDate: {
		type: Date,
		required: true
	},
	tasks: {
		type: Array
	}
});

mongoose.model('Phase', phaseSchema);