'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

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
		ref 		: 'Project'
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
