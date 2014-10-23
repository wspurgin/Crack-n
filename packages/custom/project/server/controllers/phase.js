'use strict';

/**
 * Module dependencies.
 */
 
var mongoose = require('mongoose'),
  Phase = mongoose.model('Phase');

exports.all = function (req, res) {
	if (req.project) {
		var project = req.project;
		return res.json(200, project.phases);
	}
	else {
		return res.json('Nah bro, there aint no project');
	}
};

exports.show = function (req, res) {
	if (req.phase) {
		return res.json(200, req.phase);
	}
	else {
		return res.json('Get real bro');
	}
	
};

exports.addPhase = function (req, res) {
    var phase = new Phase();
    phase.name = req.name;
    phase.startDate = req.startDate;
    phase.endDate = req.endDate;
    phase.save();
    return res.json(201);
};