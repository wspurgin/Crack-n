'use strict';

/**
 * Module dependencies.
 */
 
var mongoose = require('mongoose'),
  Phase = mongoose.model('Phase');

exports.all = function (req, res) {
	var project = req.project;
    return res.json(200, project.phases);
};

exports.show = function (req, res) {
	return res.json(200, req.phase);
};

exports.addPhase = function (req, res) {
    var phase = new Phase();
    phase.name = req.name;
    phase.startDate = req.startDate;
    phase.endDate = req.endDate;
    phase.save();
    return res.json(201);
};