'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
	Task = mongoose.model('Task'),
	Phase = mongoose.model('Phase'),
	Project=mongoose.model('Project');

var activity = require('../controllers/activity');

exports.all=function(req,res) {
	var project_id = req.params.project_id;
	var phase_id = req.params.phase_id;
	Project.findOne( {'_id':project_id}).exec(function(err, result) {
		if (!err && result) {
			Phase.findOne( {'_id':phase_id}).exec(function(err, result_phase) {
				if (!err && result_phase) {
					return res.json(200,result_phase.tasks);
				}
				else {
					return res.status(400).send('Could not find phase with id ' + req.params.phase_id);
				}
			});
		}
		else {
			return res.status(400).send('Could not find project with id ' + req.params.project_id);
		}
		console.log('project' + result.task );
	});
};


exports.complete=function(req, res) {
	var project_id=req.params.project_id;
	var task_id=req.params.task_id;
	Project.findOne({'_id': project_id }).exec(function(err,result) {
		if (!err && result) {
			Task.findOne( {'_id':task_id} ).exec(function(err, result_task) {
				if (!err && result_task) {
					if(!result_task.completed){
						result_task.completed=true;
						result_task.save();
						activity.createEntry('Task', 'Completed', req.user, project_id);
						return res.status(200).json(result_task);
					}
					else
					{
						return res.status(204).send();
					}  
				}
				else {
					return res.status(404).send();
				}
			});
		}
		else {
			return res.status(404).send();
		}
	});
};

exports.create=function(req, res) {
	var project_id = req.params.project_id;
	var phase_id=req.params.phase_id;
	Project.findOne( {'_id':project_id} ).exec(function(err,result) {
		if (!err && result) {
			Phase.findOne({'_id':phase_id}).exec(function(err, result_task) {
				if (!err && result_task) {
					var task=new Task();
					task.name=req.body.name;
					task.description=req.body.description;
					task.assignedMembers=req.body.assignedMembers;
					if(req.body.dueDates) task.dueDates=req.body.dueDates;
					task.save();
					result_task.tasks.push(task._id);
					result_task.save();
					activity.createEntry('Task', 'Created', req.user, project_id);
					return res.status(201).json(task);
				}
				else {
					return res.status(400).send('Could not find phase with id ' + req.params.phase_id);
				}
			});
		}
		else {
			return res.status(400).send('Could not find project with id ' + req.params.project_id);
		}
		console.log('project '+result.task);
	});
};
exports.edit=function(req, res) {
	var project_id=req.params.project_id;
	var task_id=req.params.task_id;
	Project.findOne( {'_id':project_id} ). exec(function(err, result) {
		if (!err && result) {
			Task.findOne ( {'_id':task_id} ).exec(function(err, result_task) {
				if (!err && result_task) {
					if (req.body.name) result_task.name=req.body.name;
					if (req.body.completed) result_task.completed=req.body.completed;
					if (req.body.description) result_task.description=req.body.description;
					if (req.body.assignedMembers) result_task.assignedMembers=req.body.assignedMembers;
					if (req.body.dueDates) result_task.dueDates=req.body.dueDates;
					result_task.save();
					activity.createEntry('Task', 'Edited', req.user, project_id);
					return res.json(200, 'Successfully edited task!', result_task);
				}
				else {
					return res.status(400).send('Could not find task with id ' + req.params.task_id);
				}
			});
		}
		else {
			return res.status(400).send('Could not find project with id ' + req.params.project_id);
		}
	});
};

exports.show=function(req,res) {
	var project_id=req.params.project_id;
	var task_id=req.params.task_id;
	var phase_id=req.params.phase_id;
	Project.findOne({'_id': project_id}).exec(function(err, result) {
		if (!err && result) {
			Phase.findOne( {'_id': phase_id}).exec(function(err, result_phase) {
				if (!err && result_phase) {
					Task.findOne( {'_id':task_id}).exec(function(err,result_task) {
						if (!err && result_task) {
							return res.json(200, result_task);
						}
						else {
							return res.status(400).send('Could not find task with id ' + req.params.task_id);
						}
					}); 
				}
				else {
					return res.status(400).send('Could not find phase with id ' + req.params.phase_id);
				}
			});			
		}
		else {
			return res.status(400).send('Could not find project with id ' + req.params.project_id);
		}
	});
};

exports.delete=function(req,res) {
	var project_id=req.params.project_id;
	var phase_id=req.params.phase_id;
	var task_id=req.params.task_id;
	Project.findOne({'_id':project_id}).exec(function(err, result) {
		if (!err && result) {
			Phase.findOne({'_id':phase_id}).exec(function(err, result_phase){
				if (!err && result_phase) {
					Task.findOne({'_id':task_id}).exec(function(err, result_task) {
						if (!err, result_task) {
							result_task.remove();
							result_task.save();
							result_phase.save();
							activity.createEntry('Task', 'Removed', req.user, project_id);
							return res.json(200, 'Successfully removed task!');
						}
						else {
							return res.status(400).send('Could not find task with id ' +req.params.task_id);
						}
					});
				result_phase.tasks.remove(req.params.task_id);
				}
				else {
					return res.status(400).send('Could not find phase with id ' + req.params.phase_id);
				}
			});
		}
		else {
			return res.status(400).send('Could not find project with id ' +req.params.project_id);
		}
	});
};
