'use strict';

var ActivityLog = require('../controllers/activity');

module.exports = function(MeanUser, app, auth, database, passport) {

  app.route('/projects/:project_id/activity')
    .get(ActivityLog.getProjectActivity);
    
  app.route('/activity/populate')
    .post(ActivityLog.populate);

  app.route('/activity/populate')
    .delete(ActivityLog.clearProject);

};