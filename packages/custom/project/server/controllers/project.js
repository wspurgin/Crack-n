'use strict';

/**
 * Project Controller
 */

/**
 * Module depedencies.
 */
var mongoose = require('mongoose'),
  Project = mongoose.model('Project'),
  User = mongoose.model('User'),
  activity = require('../controllers/activity'), 
  adminAuth = require('../controllers/adminAuth');

var adminAuth = require('../controllers/adminAuth');  

/**
/* Shows All Projects
*/
exports.all = function (req, res) {
	var user_id = req.user.id;  
	console.log(user_id);
	//'5462c842bf45a4000017b366'
	Project.find({$or: [{ 'members': { $elemMatch: { '_id' : String(user_id)}}}, {'owner' : user_id} ]}).exec(function(err, result) {
		if (result && !err) {
			return res.status(200).json(result);
		}
		else {
			return res.status(400).send('Could not find projects');
		}
		console.log('project ' + result);
	});
};

/**
 * Shows a Single Project depending on given Project_Id
 */
exports.show = function (req, res) {
	var project_id = req.params.project_id;
	console.log('project_id ' + project_id);
	Project.findOne( {'_id': project_id} )
    .lean()
    .populate('phases')
    .exec(function(err, result) {
  		if (!err && result) {
        var options = {
          path: 'phases.tasks',
          model: 'Task'
        };
        Project.populate(result, options, function (err, project) {
          if (err) console.log(err);
          return res.status(200).json(project);
        });
  			
  		}
  		else {
  			return res.status(404).send('Could not find project with id ' + req.params.project_id);
  		}
  		console.log('project ' + result);
	}); //MONGODB
	
};

/** 
 * Edit a Project
 */
exports.edit = function (req, res) {
	var project_id = req.params.project_id;
	Project.findOne( {'_id': project_id} ).exec(function(err, result) {
		if (!err) {
			return res.json(200, result, 'Successfully edited phase');
		}
		else {
			return res.status(400).send('Could not find project with id ' + req.params.project_id);
		}
		console.log('project ' + result);
	});

};

/**
 * Create a Project
 */
exports.addProject = function (req, res) {
	var project = new Project();
  	project.name = req.body.name;
 	if (req.body.startDate) project.startDate = req.body.startDate;
 	else project.startDate = Date.now();
  	project.endDate = req.body.endDate;
 	project.phases = [];
 	project.owner = req.body.owner;
 	project.members = req.body.members;
 	project.messages = [];
  	project.save();
  	return res.status(201).json(project);
};

/**
* Delete a project
*/

exports.remove = function (req, res) {
    var project_id = req.params.project_id;
    var owner = req.body.owner;
    Project.findOne({'_id': project_id}).exec(function(err, result){
    if (owner === Project.owner && !err){
	Project.remove();
	return res.status(200).send('Project Deleted');
    }
    else return res.json('Error'); 
    });
};


/**
 * Add Group Members to Project
 *
 *	- Members stored as JSON objects
 *	- Members attributes:
 *		_id	: String,
 *		name : String,		
 *		permission : String		
 *
 */
exports.addMembers = function (req, res) {
	var present = false;
	Project.findOne({'_id': req.params.project_id}).exec(function(err, result){
		if (adminAuth.isAdmin(req.user.id, result)){
			if (!err && result) {
				var members = result.members;
				for (var i = 0; i < members.length; i+=1) {
					if (members[i]._id === req.body._id || result.owner === req.body._id){
						present = true;
						break;
					}
				}
				if (present === true) {
					return res.status(202).send('User with that id is already a member in group');
				}
				else {
					User.findOne({ '_id': req.body._id }).exec(function(err, result){

						if (result && !err) {
							console.log('found one! ' + result.active);
							if (result.active === false){
								console.log('Should not add');
								return res.status(403).send('User account is inactive');
							}
							else {
								Project
								  .update(
							   		{ _id: req.params.project_id },
							  		{ $push: { members: req.body } }
							  	  )
							  	  .exec(function(err, result) {
							  	  	if (err) return res.status(400).send(err);
							  	  	activity.createEntry('Member', 'Added', req.body, req.params.project_id);
							  	  	return res.status(201).send('Members added successfully');
							  	  });
							}
						}
						else {
							return res.status(400).send(err);
						}
					});
				}
			}
		}
		else {
			return res.status(403).send('This action is reserved for member admins');
		}
	});

};

/**
 * Shows Group Members of a Project
 */ 
exports.members = function (req, res) {
	//This needs to only return active users, and I think the best way to do this is to
	//remove users from all of their groups when they delete, or make inactive, their accounts
	var project_id = req.params.project_id;
	console.log('project_id ' + project_id);
	Project.find( {'_id': project_id} ).exec(function(err, result) {
		if (!err) {
			var project = result[0];
			var members = project.members;
			return res.status(200).json(members);
			// Put Code for Showing Members here
		}
		else {
			return res.status(400).send('Could not find project with id ' + req.params.project_id);
		}
		console.log('project ' + result);
	});
}; 	

/**
* Remove a user from the project using a passed user._id string.
*/
exports.removeMember = function (req, res) {
	Project
	  .update(
	  	{ _id: req.params.project_id },
	  	{ $pull: { members: {_id : req.params.member_id} } }
	  )
	  .exec(function(err, result) {
  	    if (err || !result) {
  	    	console.log('Member removal unsuccessful'); 
  	    	res.status(400).send('Member removal unsuccessful');
  	    }
  	    if (adminAuth.isAdmin && adminAuth.getAdminCount === 1) {
  	    	res.status(401).send('Cannot remove member. There must be at least one admin on this project.');
  	    }
  	    activity.createEntry('Member ' + req.params.member_id, 'Removed', req.user, req.params.project_id);
        console.log(result);
  	    res.status(200).send('Member removed successfully');
	  }
  	);
};

/**
* Change a user's permission using a passed user._id and permission string
*/
exports.changePermission = function (req, res)  {
	console.log(req.body);
	Project
	  .update(
	  	{ _id : req.params.project_id, 'members._id' : req.body.member_id },
	  	{ $set: {'members.$.permission': req.body.permission }}
	  )
	  .exec(function(err, result) {
	  	if (err) {
	  	  console.log(err);
	  	  res.status(400).send();
	  	}
  	    res.status(200).send('Member edited successfully');
	  });

};


