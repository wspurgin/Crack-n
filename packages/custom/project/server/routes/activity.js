'use strict';

var ActivityLog = require('../controllers/activity');

module.exports = function(MeanUser, app, auth, database, passport) {

  app.route('/activity/project')
  	.get(ActivityLog.getProject);

  app.route('/activity/project')
    .post(ActivityLog.clearProject);

  app.route('/activity/user')
    .get(ActivityLog.getUser);

  app.route('/activity/populate')
    .post(ActivityLog.populate);

  app.route('/activity/task/create')
  	.post(ActivityLog.createTask);

   app.route('/activity/task/complete')
  	.post(ActivityLog.completeTask);

   app.route('/activity/phase/create')
  	.post(ActivityLog.createPhase);

   app.route('activity/message/create')
  	.post(ActivityLog.postMessage);

};