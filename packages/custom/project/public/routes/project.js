'use strict';

angular.module('mean.project').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('project', {
        url: '/project/:projectId',
        templateUrl: 'project/views/project.html'
      })
      .state('project_create', {
        url: '/projects/create',
        templateUrl: 'project/views/create.html'
      });
      /*.state('projects', {
        url: '/projects',
        templateUrl: 'project/views/my-projects.html'
      });*/
  }
]);
