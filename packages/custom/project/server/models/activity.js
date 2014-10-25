'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.schema;

/**
* Activity log-entry Schema
*/
var logEntrySchema = new Schema ({
	userName		: String,
	body 		 	: String,
	user_id	: {
		type 		: Schema.Types.ObjectId,
		ref			: 'User'
	},
	project_id : {
		type 		: Schema.Types.ObjectId, 
		ref     	: 'Project'
	},
	description : { 
		type : {
			type 	: String,
			trim	: true
		},
		action : { 
			type 	: String,
			trim 	: true
		}
	},
	timestamp : {
		type		: Date,
		default		: Date.now
	}
});

/**
* Virtuals
*/
// activityLog.virtual('.example').get( function() { };

mongoose.model('ActivityLog', logEntrySchema);
