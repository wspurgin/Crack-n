'use strict';

// The Package is past automatically as first parameter
module.exports = function(Project, app, auth, database) {

var project = require('../controllers/project');

app.use('/project*', function(req, res, next){
  if (req.user !== undefined){
    next();
  }
  else {
    res.status(401).send();
  }
})

///////////////////////////////////////////////////////////////////

  app.get('/project/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/project/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/project/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/project/example/render', function(req, res, next) {
    Project.render('index', {
      package: 'project'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });

/////////////////////////////////////////////////////////////


  app.route('/projects')
    .get(project.all);

  app.route('/projects/:project_id')
    .get(project.show);

  app.route('/projects/:project_id')
    .put(project.edit);

  app.route('/projects')
    .post(project.addProject);
};
