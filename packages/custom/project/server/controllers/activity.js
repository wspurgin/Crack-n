'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
	ActivityLog = mongoose.model('ActivityLog');

/**
* Return json of full log for a Project (passed in req body) 
*/
exports.getProject = function(req, res) {
	ActivityLog
	  .find({'project_id': req.body._id})
	  .sort('timestamp')
	  .exec(function(err, projectLog) {
		if (err) return res.status(400).json(err); 
		else return res.json(projectLog);
	  });
	return res.status(400).json({error: 'getProject Query failed: ' + req.body.name});
};

/**
* Clears the database of all activity logs for a Project
*/
exports.clearProject = function(req, res) {
	ActivityLog
	  .find({'project_id': req.body._id})
	  .remove()
	  .exec(function(err) {
	  	if (err) return res.status(400).json(err);
	  	else return res.status(200);
	  });
	return res.status(400).json({error: 'clearDatabase Query failed: ' + req.body.name});
};

/**
* Return a json of full log for a given User
*/
exports.getUser = function(req, res ) {
	ActivityLog
	  .find({'user_id': req.body._id})
	  .sort('timestamp')
	  .exec(function(err, userLog) {
	  	if (err) return res.status(400).json(err);
	  	else return res.json(userLog);
	  });
	return res.status(400).json({error: 'getUser Query failed: ' + req.body.name});
};

/**
* Log a Task creation for a given User
*/
exports.createTask = function(req, res) {
	try {
		var logEntry = new ActivityLog();
		logEntry.userName = req.body.name;
		logEntry.user_id = req.body._id;
		// logEntry.project_id = req.body.project_id;
		logEntry.description.type = 'Task';
		logEntry.description.action = 'Created';
		logEntry.body = 'created a Task';
		logEntry.save();
		return res.status(201); 
	} catch(err) {
		return res.status(400).json(err);
	}
}; 

/**
* Log a Task completion for a given User
*/
exports.completeTask = function(req, res) {
	try {
		var logEntry = new ActivityLog();
		logEntry.userName = req.body.name;
		logEntry.user_id = req.body._id;
		// logEntry.project_id = req.body.project_id;
		logEntry.description.type = 'Task';
		logEntry.description.action = 'Completed';
		logEntry.body = 'completed a Task';
		logEntry.save();
		return res.status(201); 
	} catch(err) {
		return res.status(400).json(err);
	}
};

/**
* Log a Phase creation for a given User
*/
exports.createPhase = function(req, res) {
	try {
		var logEntry = new ActivityLog();
		logEntry.userName = req.body.name;
		logEntry.user_id = req.body._id;
		// logEntry.project_id = req.body.project_id;
		logEntry.description.type = 'Phase';
		logEntry.description.action = 'Created';
		logEntry.body = 'created a Phase';
		logEntry.save();
		return res.status(201); 
	} catch(err) {
		return res.status(400).json(err);
	}
};
/**
* Log a message post for a given User
*/
exports.postMessage = function(req, res) {
	try {
		var logEntry = new ActivityLog();
		logEntry.userName = req.body.name;
		logEntry.user_id = req.body._id;
		// logEntry.project_id = req.body.project_id;
		logEntry.description.type = 'Message';
		logEntry.description.action = 'Posted';
		logEntry.body = 'posted a message';
		logEntry.save();
		return res.status(201); 
	} 
	catch(err) {
		return res.status(400).json(err);
	}
};

/** 
* Populate an example ActivityLog for testing purposes
*/
// exports.populateTest = function(req, res) { };