'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
	ActivityLog = mongoose.model('ActivityLog'),
	path = require('path'),
	fs = require('fs');
 
/**
* String formatting 
*/
String.prototype.entryFormat = function() {
     return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

/**
* Type validation
*/
var valid = function(type) {
	switch (type) {
		case 'Message':
			return true;
		case 'Phase':
			return true;
		case 'Member':
			return true;
		case 'Task':
			return true;
	} 
	console.log('Invalid type (controllers/activity.js:21:1)');
	return false;
};

/**
* Action validation 
*/
var valid = function(action, type) {
	switch (type) {
		case 'Message':
			if (action === 'Created' || action === 'Removed')
				return true;
			break;
		case 'Phase':
			if (action === 'Created' || action === 'Completed' || action === 'Removed')
				return true;
			break;
		case 'Member':
			if (action === 'Added' || action === 'Removed')
				return true;
			break;
		case 'Task':
			if (action === 'Created' || action === 'Completed' || action === 'Removed')
				return true;
			break;
	} 
	console.log('Invalid action (controllers/activity.js:39:1)');
	return false;
};

/**
* Produce a body message
*/
var concatBody = function(type, action) {
	type.toLowerCase();
	action.toLowerCase();
	if (type === 'message' && action === 'created')
		action = 'posted';
	return type + ' a ' + action;
};

/**
* Create an ActivityLog entry
*
*   API (not case sensitive):
*  ////////////////////////////////////////////////////////
*  //	 type	: Message, Phase, Member, Task, Project  //
*  //	 action : Created, Completed, Added, Removed 	 //
*  //		      (only Members can be added)			 //
*  ////////////////////////////////////////////////////////
*/
exports.createEntry = function(type, action, user, project_id) {
	try {
		var entry = new ActivityLog();
		entry.userName = user.userName;
		entry.user_id = user._id;
		entry.project_id = project_id;
		type.entryFormat();
		action.entryFormat();
		if (valid(type)) 
			entry.description.type = type;
		if (valid(action, type))
			entry.description.action = action;
		entry.body = concatBody(type, action);
		entry.save();
		console.log('Created activity');
	} catch(err) {
		console.log('createEntry error, check API @ (controllers/activity.js:82:0): ' + err);
	}
};

/**
* Pass a log of all Project Activity to callback parameter
* Req can be a request object, or a string (as in the case of call in testGetProject)
*/
exports.getActivity = function(req, callback) {
	var project_id;
	if (typeof(req) === 'string')
		project_id = req;
	else 
		project_id = req.params.project_id;
	ActivityLog
      .find({'project_id': project_id})
	  .sort('timestamp')
	  .lean()
	  .exec(function(err, log) {
		if (err) console.log('Query error (controllers/activity.js:22:15): ' + err);
	    callback(log);
	});
};

/** 
* Populate an example ActivityLog for testing purposes
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
* Clears the database of all activity logs for testing purposes
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
* Test getProject query using callback
*/
exports.testGetProject = function(req , res) {
	var test_id = '111111111111111111111111';
	exports.getActivity(test_id, function(log) {
		// Example log array traversal:  
		for (var key in log) {
			console.log(log[key]);
		}
		// Example json response 
		return res.status(200).json(log); 
	});
};

/**
* Example log entry creation
*/
/*
exports.testCreateEntry = function(req, res) {
	try {
		exports.createEntry('Message', 'Posted', req.user, req.params.project_id);
	} catch (err) {
		return res.status(400).send('testCreateEntry() failed (controllers/activity.js:22:15): ' + err);
	}
};
*/

