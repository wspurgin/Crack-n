'use strict';
 
var messages = require('../controllers/messageBoard');
 
module.exports = function(MessageBoard, app, auth, database, passport) {
  
  app.route('/:project_id/messages')
    .get(messages.projectMessages);

  app.route('/:project_id/new-message')
  	.post(messages.addMessage);
   
};