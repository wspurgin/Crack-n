'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

/**
* Activity log-entry Schema
*/
var logEntrySchema = new Schema ({
	userName		: String,
	body 		 	: String,
	user_id			: Schema.Types.ObjectId,
	project_id 		: Schema.Types.ObjectId, 
	description : { 
		type : {
			type 	: String,
			trim 	: true
		},
		action : {
			type 	: String, 
			tring 	: true
		}
	},
	time : {
		type		: Date,
		default		: Date.now
	}
});

/**
* Virtuals
*/
// activityLog.virtual('.example').get( function() { };

mongoose.model('ActivityLog', logEntrySchema);
