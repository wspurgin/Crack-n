 'use strict';

var ActivityLog = require('../controllers/activity');

module.exports = function(MeanUser, app, auth, database, passport) {


  app.route('/activityLog')
  	.get(ActivityLog.getProjectLog);

  /*
  app.route('/activityLog')
    .get(ActivityLog.getUserLog);
  */

  app.route('/activityLog')
  	.post(ActivityLog.createTask);

   app.route('/activityLog')
  	.post(ActivityLog.completeTask);

   app.route('/activityLog')
  	.post(ActivityLog.createPhase);

   app.route('/activityLog')
  	.post(ActivityLog.postMessage);


};