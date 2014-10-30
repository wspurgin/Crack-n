'use strict';

var ActivityLog = require('../controllers/activity');

module.exports = function(MeanUser, app, auth, database, passport) {

  app.route('/activity/test')
  	.get(ActivityLog.testGetProject);

  app.route('/projects/:project_id/activity')
    .get(ActivityLog.getActivity);

  /*
  app.route('/project/:project_id/test')
    .get(ActivityLog.testGet);
  */
  
  app.route('/activity/populate')
    .post(ActivityLog.populate);

  app.route('/activity/populate')
    .delete(ActivityLog.clearProject);

};