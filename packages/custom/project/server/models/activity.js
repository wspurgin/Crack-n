'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
* Activity log-entry Schema
*/
var logEntrySchema = new Schema ({
	userName : {
		type 		: String,
		require		: true
	},
	body : {
		type 		: String,
		require 	: true
	},
	user_id	: {
		type 		: Schema.Types.ObjectId,
		ref			: 'User'
	},
	project_id : { 
		type 		: Schema.Types.ObjectId, 
		ref 		: 'Project',
		require		: true
	},
	description : { 
		type : {
			type 	: String,
			trim 	: true
		},
		action : {
			type 	: String, 
			trim 	: true
		}
	},
	time : {
		type		: Date,
		default		: Date.now
	}
});

mongoose.model('ActivityLog', logEntrySchema);
