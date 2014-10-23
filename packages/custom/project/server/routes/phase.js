'use strict';
 
var phase = require('../controllers/phase');
 
module.exports = function(Phase, app, auth, database, passport) {
  
  app.route('/projects/:project_id/phases')
    .get(phase.all);

  app.route('/projects/:project_id/phases/:phase_id')
    .get(phase.show);

  app.route('/projects/:project_id/new-phase')
  	.post(phase.addPhase);
   
};