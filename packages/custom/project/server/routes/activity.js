'use strict';

var ActivityLog = require('../controllers/activity');

module.exports = function(MeanUser, app, auth, database, passport) {

  app.route('/projects/:project_id/activity')
    .get(ActivityLog.getProjectActivity);

 // route needs to get deleted later
   app.route('/activity/test/search')
     .get(ActivityLog.searchUsers);

   app.route('/activity/test')
     .post(ActivityLog.testCreateEntry);

  app.route('/activity/populate')
    .post(ActivityLog.populate);

  app.route('/activity/populate')
    .delete(ActivityLog.clearProject);

};