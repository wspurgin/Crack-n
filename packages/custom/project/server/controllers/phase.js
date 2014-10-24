'use strict';

/**
 * Module dependencies.
 */
 
var mongoose = require('mongoose'),
  Phase = mongoose.model('Phase'),
  Project = mongoose.model('Project');

exports.all = function (req, res) {
	var project_id = req.params.project_id;
	Project.findOne( {'_id': project_id} ).exec(function(err, result) {
		if (!err) {
			return res.json(200, result.phases);
		}
		else {
			return res.json('Nah bro, there aint no project');
		}
		console.log('project ' + result.phases);
	}); //MONGODB
};

exports.show = function (req, res) {
	var project_id = req.params.project_id;
	var phase_id = req.params.phase_id;
	Project.findOne( {'_id': project_id} ).exec(function(err, result) {
		if (!err) {
			for (var p in result.phases){
				if (p.id === phase_id) {
					var phase = p;
					return res.json(200, phase);
				}
			}	
		}
		else {
			return res.json('Nah bro, there aint no project');
		}
		console.log('project ' + result.phases);
	}); //MONGODB
};

exports.edit = function (req, res) {
	var project_id = req.params.project_id;
	var phase_id = req.params.phase_id;
	Project.findOne( {'_id': project_id} ).exec(function(err, result) {
		if (!err) {
			for (var p in result.phases){
				if (p.id === phase_id) {
					var phase = p;
					if (req.body.name) phase.name = req.body.name;
					if (req.body.startDate) phase.startDate = req.body.startDate;
					if (req.body.endDate) phase.endDate = req.body.endDate;
					return res.json(200, 'Successfully edited phase', phase);
				}
			}
		}
		else {
			return res.json('Nah bro, there aint no project');
		}
		console.log('project ' + result.phases);
	}); //MONGODB

};

exports.addPhase = function (req, res) {
	var project_id = req.params.project_id;
	Project.findOne( {'_id': project_id} ).exec(function(err, result) {
		if (!err) {
			var phase = new Phase();
		    phase.name = req.body.name;
		    phase.startDate = req.body.startDate;
		    phase.endDate = req.body.endDate;
		    phase.save();
		    result.phases.push(phase);
		    return res.json(201);
		}
		else {
			return res.json('Nah bro, there aint no project');
		}
		console.log('project ' + result.phases);
	}); //MONGODB

};