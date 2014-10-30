'use strict';

var ActivityLog = require('../controllers/activity');

module.exports = function(MeanUser, app, auth, database, passport) {

  app.route('/activity/test')
  	.get(ActivityLog.testGetProject);

/*
  app.route('/activity/test')
    .post(ActivityLog.test)
*/

  app.route('/activity/populate')
    .post(ActivityLog.populate);

  app.route('/activity/populate')
    .delete(ActivityLog.clearProject);

};