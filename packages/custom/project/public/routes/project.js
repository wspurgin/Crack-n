'use strict';

angular.module('mean.project').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('project', {
        url: '/project',
        templateUrl: 'project/views/project.html'
      })
      .state('project_create', {
        url: '/project/create',
        templateUrl: 'project/views/create.html'
      });
  }
]);
