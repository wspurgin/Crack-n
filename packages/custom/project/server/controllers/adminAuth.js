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
	else {
		for (var i = 0; i < project.members.length; i+=1){
			var member = project.members[i];
			if (String(member._id) === String(user_id)){
				if (member.permission === 'admin'){
					return true;
				}
			}
		}
		return false;
	}
};

