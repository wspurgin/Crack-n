'use strict';

/**
* Module dependencies
*/

var mongoose = require('mongoose'),
	Task = mongoose.model('task'),
	Project=mongoose.model('Project');

exports.all=function(req,res) {
	var project_id = req.params.project_id;
	Project.findOne( {'_id':project_id}).exec(function(err, result) {
		if (!err) {
			return res.json(200, result.task);
		}
		else {
			return res.json('Task does not exist!');
		}
		console.log('project' + result.task );
	});
};


//assign task to member
exports.assign=function (req, res) {
	var project_id = req.params.project_id;
	Project.findOne({'_id':project_id}).exec(function(err, result) {
		if (!err) {
			return res.json(200, result.task);
		}
		else {
			return res.json('Project does not exist!');
		}
		console.log('project' + result.task);
	});
};

exports.complete=function(req, res) {
	var project_id=req.params.project_id;
	var task_id=req.params.task_id;
	Project.findOne({'_id': project_id }).exec(function(err,result) {
		if (!err) {
			Task.findOne( {'_id':task_id} ).exec(function(err, result_task) {
				if (!err) {
					if(req.body.completed===false){
						result_task.completed=true;
						result_task.save();
						return res.json(200, 'Successfully completed task!');
					}
					else
					{
						return res.json('Task is already completed');
					}  
				}
				else {
					return res.json('Task does not exist!');
				}
			});
		}
		else {
			return res.json('Project does not exist!');
		}
	});
};

exports.create=function(req, res) {
	var project_id = req.params.project_id;
	Project.findOne( {'_id':project_id} ).exec(function(err,result) {
		if (!err) {
			var task=new Task();
			task.name=req.body.name;
			task.description=req.body.description;
			task.assignedMembers=req.body.assignedMembers;
			task.dueDates=req.body.dueDates;
			task.save();
			result.task.push(task);
			result.save();
			return res.json(201);
		}
		else {
			return res.json('Project does not exist!');
		}
		console.log('project '+result.task);
	});
};
exports.edit=function(req, res) {
	var project_id=req.params.project_id;
	var task_id=req.params.task_id;
	Project.findOne( {'_id':project_id} ). exec(function(err, result) {
		if (!err) {
			Task.findOne ( {'_id':task_id} ).exec(function(err, result_task) {
				if (!err) {
					if (req.body.name) result_task.name=req.body.name;
					if (req.body.completed) result_task.completed=req.body.completed;
					if (req.body.description) result_task.description=req.body.description;
					if (req.body.assignedMembers) result_task.assignedMembers=req.body.assignedMembers;
					if (req.body.dueDates) result_task.dueDates=req.body.dueDates;
					result_task.save();
					return res.json(200, 'Successfully updated task!');
				}
				else {
					return res.json('Task does not exist!');
				}
			});
		}
		else {
			return res.json('Project does not exist!');
		}
	});
};

exports.delete=function(req,res) {
	var project_id=req.params.project_id;
	var task_id=req.params.task_id;
	Project.findOne({'_id': project_id}).exec(function(err, result){
		if (!err) {
			Task.findOne( {'_id':task_id}).exec(function(err, result_task) {
				if (!err) {
					result_task.delete();
					return res.json (200, 'Successfully deleted task!');
				}
				else {
					return res.json ('Task does not exist');
				}
			});
		}
		else {
			return res.json('Project does not exist');
		}
	});
};
