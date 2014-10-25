'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
	// Project = mongoose.model('Project'),
	ActivityLog = mongoose.model('ActivityLog');
	
/**
* Return json of Project log for a given project id 
*/
exports.getLog = function(req, res) {
	var project_id = req.body._id;
	ActivityLog
	  .find({'project_id': project_id})
	  .sort('timestamp')
	  .exec(function(err, log) {
		if (err) return res.status(400).json(err); 
		return res.json(log);
	  });
	return res.status(400).json({ error: 'getLog Query failed: ' + req.body.name });
};

/**
* Log a Task creation for a given User
*/
exports.createTask = function(req,res) {
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
exports.completeTask = function(req,res) {
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