'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
	ActivityLog = mongoose.model('ActivityLog'),
	User = mongoose.model('User'),
	async = require('async'),
	path = require('path'),
	fs = require('fs');
 
/**
* String formatting 
*/
String.prototype.entryFormat = function() {
     return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

/**
* Create an ActivityLog entry
*
*   API (not case sensitive):
*  ///////////////////////////////////////////////////////////////////////
*  //	 type	: Message, Phase, Member, Task, Project  		  		//
*  //	 action : Created, Completed, Added, Removed, Posted  	  		//
*  //	 usage  : Only Members are Added, only Messages are Posted)		//
*  ///////////////////////////////////////////////////////////////////////
*/
exports.createEntry = function(type, action, user, project_id, cb) {
	var entry = new ActivityLog();
	async.waterfall([
	  // Validate type and action
	  function(callback) {
	  	type.entryFormat();
		action.entryFormat();
	  	console.log(type);
	  	console.log(action);
		switch (type) {
		  case 'Message':
		    if (action === 'Created' || action === 'Removed' || action === 'Posted') {	
		  	  callback();
		  	  break;
		  	}
		  /* falls through */
		  case 'Phase':
		    if (action === 'Created' || action === 'Completed' || action === 'Removed') {
		  	  callback();
		  	  break;
		  	}
		  /* falls through */
	 	  case 'Member':
		    if (action === 'Added' || action === 'Removed') {
		  	  callback();
		  	  break;
		  	}
		  /* falls through */
		  case 'Task':
		    if (action === 'Created' || action === 'Completed' || action === 'Removed') {
		 	  callback();
		 	  break;
		 	}
		  /* falls through */
		  default:
		    callback('invalid type / action');
	  	    break;
	     }
	  },
	  // Add the basic members
	  function(callback) {
	  	entry.description.type = type;
	  	entry.description.action = action;
	  	entry.userName = user.name;
		entry.user_id = user._id;
		entry.project_id = project_id;
	  	callback();
	  },
	  // Concatinate the log body and save
	  function(callback) {
	    type.toLowerCase();
		action.toLowerCase();
		if (type === 'message' && action === 'created')
		  action = ' posted';
		entry.body = action + ' a ' + type;
		entry.save();
		console.log('created');
		callback();
	  }
	], function(err) {
  	  if (err) console.log(err);
  	  console.log('its done');
  	  cb();
	});
};

/**
* Return activity log json of project id passed in req parameters  
*/
exports.getProjectActivity = function(req , res) {
	exports.activityProjQuery(req.params.project_id, function(log) {
	  return res.status(200).json(log); 
	});
};

/**
* Pass an object containing all Activity associated with project_id to callback parameter
*/
exports.activityProjQuery = function(project_id, callback) {
	ActivityLog
      .find({'project_id': project_id})
	  .sort('timestamp')
	  .lean()
	  .exec(function(err, log) {
		if (err) console.log('Query error (controllers/activity.js:116:0): ' + err);
	    callback(log);
	});
};

/**
* Populate an example ActivityLog
*/
exports.populate = function(req, res) {
	fs.readFile(path.join(__dirname, '../../activity.json'),
    function(err, data) {
    	if (err) res.status(400).send(err);
      	var json = JSON.parse(data.toString());
      	for (var i = 0; i < json.users.length; i+=1) {
      		var logEntry = new ActivityLog();
        	logEntry.userName = json.users[i].userName;
        	logEntry.body = json.users[i].body;
        	logEntry.user_id = json.users[i].user_id;
        	logEntry.project_id = json.users[i].project_id;
        	logEntry.description.type = json.users[i].description.type;
        	logEntry.description.action = json.users[i].description.action;
        	logEntry.save();
      	}
      	return res.status(201).json('Test database populated.');
	});
};

/**
* Clears the database of all activity logs
*/
exports.clearProject = function(req, res) {
	ActivityLog
	  .remove()
	  .exec(function(err) {
	  	if (err) return res.status(400).send(err);
	  	return res.status(200).send('Test database cleared.');
	  });
};

/**
* Example log entry creation
*/
exports.testCreateEntry = function(req, res) {
		var user = new User();
		user.name = 'Dildo Dildo-son';
		user.email = 'didlo@gmail.com';
		user.username = '360noscope23x420';
		exports.createEntry('Message', 'Posted', user, '111111111111111111111111', function() {
		  return res.status(201).send('test went well');
		});
};