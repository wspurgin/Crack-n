'use strict';

var task = require('../controllers/task');

module.exports=function(Task, app, auth, database) {
	app.route('/projects/:project_id/phases/:phase_id/tasks').get(task.all);
	app.route('/projects/:project_id/phases/:phase_id/tasks/:task_id').post(task.assign);
	app.route('projects/:project_id/phases/:phase_id/tasks/:task_id').put(task.complete);
	app.route('/projects/:project_id/phases/:phase_id').post(task.create);
	app.route('/projects/:project_id/phases/:phase_id/tasks/:task_id').put(task.edit);
	app.route('/projects/:project_id/phases/:phase_id/tasks/:task_id').delete(task.delete);

};