'use strict';

/**
 * Module dependencies.
 */

//var mongoose = require('mongoose');

//var activity = require('../controllers/activity');

exports.isOwner = function (user_id, project) {
	if (String(project.owner) === String(user_id) ){
		return true;
	}
	else {
		return false;
	}
};

exports.isAdmin = function(user_id, project) {
	if (exports.isOwner(user_id, project)){
		return true;
	}
	console.log('user_id: ' + user_id + '   owner: ' + project.owner);
	for (var member in project.members){
		if (String(member.id) === String(user_id)){
			if (member.permission === 'admin'){
				return true;
			}
		}
	}
	return false;
};

