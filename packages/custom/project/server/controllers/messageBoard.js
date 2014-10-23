'use strict';

/**
 * Module dependencies.
 */
 
var mongoose = require('mongoose'),
  Message = mongoose.model('Message');

exports.projectMessages = function (req, res) {
	return res.json(200, req.messages);
};

exports.addMessage = function (req, res) {
    var message = new Message();
    message.body = req.body;
    message.user = req.user;
    message.timestamp = Date.now;
    message.save();
    return res.json(201);
};