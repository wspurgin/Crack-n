'use strict';

/**
  * Module depedencies.
  */

var mongoose = require('mongoose'),
  Project = mongoose.model('Project');

exports.all = function (req, res) {
	Project.find().exec(function(err, result) {
		if (!err) {
			return res.json(200, result);
		}
		else {
			return res.json('Get real bro');
		}
		console.log('project ' + result);
	});
};

exports.show = function (req, res) {
	var project_id = req.params.project_id;
	console.log('project_id ' + project_id);
	Project.findOne( {'_id': project_id} ).exec(function(err, result) {
		if (!err) {
			return res.json(200, result);
		}
		else {
			return res.json('Get real bro');
		}
		console.log('project ' + result);
	}); //MONGODB
	
};

exports.edit = function (req, res) {
	var project_id = req.params.project_id;
	Project.findOne( {'_id': project_id} ).exec(function(err, result) {
		if (!err) {
			return res.json(200, result, 'Successfully edited phase');
		}
		else {
			return res.json('Get real bro');
		}
		console.log('project ' + result);
	});

};

exports.addProject = function (req, res) {
    var project = new Project();
    project.name = req.body.name;
    if (req.body.startDate) project.startDate = req.body.startDate;
    project.endDate = req.body.endDate;
    project.phases = [];
    project.admin = req.body.admin;
    project.members = [];
    project.messages = [];
    project.save();
    return res.json(201);
};

exports.remove = function (req, res) {
    var project = Project.findOne({'id': req.params.project_id});
    var admin = project.admin;
    	if (req.user.id === admin)
	  project.remove()
	  .exec(function(err) {
	  	if (err) return res.status(400).send(err);
	  	else return res.status(200).send('Test database cleared.');
	  });
};


