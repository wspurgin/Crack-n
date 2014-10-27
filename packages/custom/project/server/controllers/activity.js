'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
	ActivityLog = mongoose.model('ActivityLog'),
	fs = require('fs'),
	path = require('path');

/**
* Return json of full log for a Project (passed in req body) 
*/
exports.getProject = function(req, res) {
	ActivityLog
	  .find({'project_id': req.body._id})
	  .sort('timestamp')
	  .exec(function(err, log) {
		if (err) return res.status(400).send(err); 
		else return res.json(log);
	  });
	return res.status(400).send();
};

/**
* Clears the database of all activity logs for a Project
*/
exports.clearProject = function(req, res) {
	ActivityLog
	  .find({'project_id': req.body._id})
	  .remove()
	  .exec(function(err) {
	  	if (err) return res.status(400).send(err);
	  	else return res.status(200);
	  });
	return res.status(400).send();
};

/**
* Return a json of full log for a given User
*/
exports.getUser = function(req, res ) {
	ActivityLog
	  .find({'user_id': req.body._id})
	  .sort('timestamp')
	  .exec(function(err, log) {
	  	if (err) return res.status(400).send(err);
	  	else return res.json(log);
	  });
	return res.status(400).send();
};

// [!] The logging api (completeTask, createTask, etc.) is not finalized.

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
		return res.status(400).send(err);
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
		return res.status(400).send(err);
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
		return res.status(400).send(err);
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
	} catch(err) {
		return res.status(400).send(err);
	}
};

/** 
* Populate an example ActivityLog for testing purposes
*/
exports.populate = function(req, res) {
	fs.readFile(path.join(__dirname, '../../activity.json'),
    function(err, data) {
      if (err) res.send(400).json(err);
      var json = JSON.parse(data.toString());
      for (var i = 0; i < json.users.length; i+=1)
      {
      	var logEntry = new ActivityLog();
        logEntry.userName = json.users[i].userName;
        logEntry.body = json.users[i].body;
        logEntry.user_id = json.users[i].user_id;
        logEntry.project_id = json.users[i].project_id;
        logEntry.description.type = json.users[i].description.type;
        logEntry.description.action = json.users[i].description.action;
        logEntry.save();
      }
      return res.status(201).send();
	});
};