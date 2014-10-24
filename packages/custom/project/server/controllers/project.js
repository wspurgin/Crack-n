'use strict';

/**
  * Module depedencies.
  */

var mongoose = require('mongoose'),
  Project = mongoose.model('Project');

exports.all = function (req, res) {
	var project = Project.find(); // MongoDB
	if (project.length > 0) {
		return res.json(200, project.phases);
	}
	else {
		return res.json('No project here');
	}
};

exports.show = function (req, res) {
	var project_id = req.params.project_id;
	var project = Project.find( {'_id': project_id} ); //MONGODB
	if (project.length > 0) {
		return res.json(200, project);
	}
	else {
		return res.json('Get real bro');
	}
};

exports.edit = function (req, res) {
	var project_id = req.params.project_id;
	var project = Project.find( {'_id': project_id} ); //MONGODB
	if (project.length > 0) {
		return res.json(200, 'Successfully edited phase');
	}
	else {
		return res.json('Get real bro');
	}


};

exports.addProject = function (req, res) {
    var project = new Project();
    project.name = req.body.name;
    project.startDate = req.body.startDate;
    project.endDate = req.body.endDate;
    project.phases = [];
    project.admin = req.body.name;
    project.members = [];
    project.messeges = [];
    project.save();
    return res.json(201);
};
