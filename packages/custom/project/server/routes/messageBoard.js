'use strict';
 
var messages = require('../controllers/messageBoard');
 
module.exports = function(MessageBoard, app, auth, database, passport) {
  
  app.route('/projects/:project_id/messages')
    .get(messages.projectMessages);

  app.route('/projects/:project_id/messages')
  	.post(messages.addMessage);
   
};