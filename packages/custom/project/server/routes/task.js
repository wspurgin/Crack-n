'use strict';

var task = require('../controllers/task');

module.exports=function(Task, app, auth, database) {
	//app.route('/projects/:project_id/task').get(task.all);
	app.route('/projects/:project_id/task/:task_id').post(task.assign);
	app.route('projects/:project_id/task/:task_id').put(task.complete);
	app.route('/projects/:project_id/task').post(task.create);
	app.route('/projects/:project_id/task').put(task.edit);

};