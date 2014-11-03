'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Message = mongoose.model('Message'),
  Project = mongoose.model('Project');

var activity = require('../controllers/activity');

exports.projectMessages = function (req, res) {
	var project_id = req.params.project_id;
	Project.findOne( {'_id': project_id} ).exec(function(err, result) {
		if (!err) {
			return res.status(200).json(result.messages);
		}
		else {
			return res.status(400).json(err);
		}
		console.log('project ' + result);
	});
};

exports.addMessage = function (req, res) {
	var project_id = req.params.project_id;
	Project.findOne( {'_id': project_id} ).exec(function(err, result) {
		if (!err) {
			var message = new Message();
		    message.body = req.body.body;
		    message.user = req.body.user;
		    message.save();
		    console.log('<: ' + message);
		    result.messages.push(message);
		    result.save();
		    activity.createEntry('Message', 'Created', req.user, project_id);
			return res.json(200, result);
		}
		else {
			return res.json('Get real bro');
		}
		console.log('project ' + result);
	});
};