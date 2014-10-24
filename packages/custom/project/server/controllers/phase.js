'use strict';

/**
 * Module dependencies.
 */
 
var mongoose = require('mongoose'),
  Phase = mongoose.model('Phase'),
  Project = mongoose.model('Project');

exports.all = function (req, res) {
	var project_id = req.params.project_id;
	var project = Project.find( {'_id': project_id} ); //MONGODB
	if (project.length > 0) {
		return res.json(200, project.phases);
	}
	else {
		return res.json('Nah bro, there aint no project');
	}
};

exports.show = function (req, res) {
	var project_id = req.params.project_id;
	var phase_id = req.params.phase_id;
	var project = Project.find( {'_id': project_id} ); //MONGODB
	if (project.length > 0) {
		for (var p in project.phases){
			if (p.id === phase_id) {
				var phase = p;
				return res.json(200, phase);
			}
		}
	}
	else {
		return res.json('Get real bro');
	}
};

exports.edit = function (req, res) {
	var project_id = req.params.project_id;
	var phase_id = req.params.phase_id;
	var project = Project.find( {'_id': project_id} ); //MONGODB
	if (project.length > 0) {
		for (var p in project.phases){
			if (p.id === phase_id) {
				var phase = p;
				if (req.name) phase.name = req.body.name;
				if (req.startDate) phase.startDate = req.body.startDate;
				if (req.endDate) phase.endDate = req.body.endDate;
				return res.json(200, 'Successfully edited phase');
			}
		}
	}
	else {
		return res.json('Get real bro');
	}


};

exports.addPhase = function (req, res) {
	var project_id = req.params.project_id;
	var project = Project.find( {'_id': project_id} ); //MONGODB
    var phase = new Phase();
    phase.name = req.body.name;
    phase.startDate = req.body.startDate;
    phase.endDate = req.body.endDate;
    phase.save();
    project.phases.push(phase);
    return res.json(201);
};