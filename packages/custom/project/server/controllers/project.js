'use strict';

/**
 * Module depedencies.
 */
var mongoose = require('mongoose'),
  Project = mongoose.model('Project');

/**
/* Shows All Projects
*/
exports.all = function (req, res) {
	var user_id = req.body.user;
	Project.find({'user_id': user_id}).exec(function(err, result) {
		if (!err) {
			return res.json(200, result);
		}
		else {
			return res.status(400).send('Could not find project with id ' + req.params.project_id);
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

/* 
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

/*
 * Create a Project
 */
exports.addProject = function (req, res) {
	var project = new Project();
  	project.name = req.body.name;
 	if (req.body.startDate) project.startDate = req.body.startDate;
  	project.endDate = req.body.endDate;
 	project.phases = [];
 	project.owner = req.body.owner;
 	project.members = req.body.members;
 	project.messages = [];
  	project.save();
  	return res.status(201).json(project);
};

/*  
 * Delete a Project from User's Project List
 */
exports.remove = function (req, res) {
    	var project_id = req.params.project_id;
	var owner = req.body.owner;
	Project.findOne({'_id': project_id}).exec(function(err, result){
	if(owner === Project.owner && !err) {
		Project.remove();
		return res.status(200).send('Test database cleared.');
	}
	else return res.json('Error'); 
	});
};

/*
 * Add Group Members to Project
 */
exports.addMembers = function (req, res) {
	Project
	  .update(
   		{ _id: req.params.project_id },
  		{ $push: { members: req.body } }
  	  )
  	  .exec(function(err, result) {
  	  	if (err) return res.status(400).send(err);
  	  	return res.status(201).send('Members added successfully');
  	  });
  	  

};

/*
 * Shows Group Members of a Project
 */ 
exports.members = function (req, res) {
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
* Remove a user from the project using a passed user._id
*/
exports.removeMember = function (req, res) {
	Project
	  .update(
	  	{ _id: req.params.project_id },
	  	{ $pull: {'members._id' : req.body} }
	  )
	  .exec(function(err, result) {
  	    if (err) return res.status(400).send(err);
  	    return res.status(200).send('Member removed successfully');
  	  });
};


