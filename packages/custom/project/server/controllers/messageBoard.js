'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Message = mongoose.model('Message'),
  Project = mongoose.model('Project');

exports.projectMessages = function (req, res) {
	var project_id = req.params.project_id;
	var project = Project.find( {'_id': project_id} ); //MONGODB
	if (project.length > 0) {
		return res.json(200, project.phases);
	}
	else {
		return res.json('Yeah right, man. Yeah right.');
	}
};

exports.addMessage = function (req, res) {
	var project_id = req.params.project_id;
	var project = Project.find( {'_id': project_id} ); //MONGODB
	if (project.length > 0) {
	    var message = new Message();
	    message.body = req.body.body;
	    message.user = req.body.user;
	    message.timestamp = Date.now;
	    message.save();
	    project.messages.push(message);

	    return res.json(201);	
	}
	else {
		return res.json('There aint no project, yo!');
	}
};