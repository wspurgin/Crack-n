'use strict';

/**
 * Module dependencies.
 */
 
var mongoose = require('mongoose'),
  Phase = mongoose.model('Phase'),
  Project = mongoose.model('Project');

var activity = require('../controllers/activity');

exports.all = function (req, res) {
	var project_id = req.params.project_id;
	Project.findOne( {'_id': project_id} ).exec(function(err, result) {
		if (!err) {
			return res.json(200, result.phases);
		}
		else {
			return res.status(400).send('Could not find project with id ' + req.params.project_id);
		}
		console.log('project ' + result.phases);
	}); //MONGODB
};

exports.show = function (req, res) {
	var project_id = req.params.project_id;
	var phase_id = req.params.phase_id;
	Project.findOne( {'_id': project_id} ).exec(function(err, result) {
		if (!err && result) {
			Phase.findOne( {'_id': phase_id} ).exec(function(err, result_phase){
				if (!err && result_phase) {
					return res.json(200, result_phase);
				}
				else {
					return res.status(400).send('Could not find phase with id ' + req.params.phase_id);
				}
			});	
		}
		else {
			return res.status(400).send('Could not find project with id ' + req.params.project_id);
		}
		console.log('project ' + result.phases);
	}); //MONGODB
};

exports.edit = function (req, res) {
	var project_id = req.params.project_id;
	var phase_id = req.params.phase_id;
	Project.findOne( {'_id': project_id} ).exec(function(err, result) {
		if (!err) {
			Phase.findOne( {'_id': phase_id} ).exec(function(err, result_phase){
				if (!err) {
					if (req.body.name) result_phase.name = req.body.name;
					if (req.body.startDate) result_phase.startDate = req.body.startDate;
					if (req.body.endDate) result_phase.endDate = req.body.endDate;
					result_phase.save();
					return res.json(200, 'Successfully edited phase', result_phase);
				}
				else {
					return res.status(400).send('Could not find phase with id ' + req.params.phase_id);
				}
			});
		}
		else {
			return res.status(400).send('Could not find project with id ' + req.params.project_id);
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
		    if(req.body.startDate) phase.startDate = req.body.startDate;
		    phase.endDate = req.body.endDate;
		    phase.save();
		    result.phases.push(phase._id);
		    result.save();
		    activity.createEntry('Phase', 'Created', req.user, project_id);
		    return res.status(201).json(phase);
		}
		else {
			return res.status(400).send('Could not find project with id ' + req.params.project_id);
		}
	}); //MONGODB

	}); 
};

	exports.delete=function(req,res) {
		var project_id=req.params.project_id;
		var phase_id=req.params.phase_id;
		Project.findOne({'_id':project_id}).exec(function(err, result) {
			if (!err && result) {
				Phase.findOne({'_id':phase_id}).exec(function(err, result_phase){
					if (!err && result_phase) {
							result_phase.remove();
							result_phase.save();
							result.save();
							return res.json(200, 'Successfully removed phase!');
					}
					else {
						return res.status(400).send('Could not find phase with id ' + req.params.phase_id);
					}
				});
				result.phases.remove(req.params.phase_id);
			}
			else {
				return res.status(400).send('Could not find project with id ' +req.params.project_id);
			}
	});
	//MONGODB

};