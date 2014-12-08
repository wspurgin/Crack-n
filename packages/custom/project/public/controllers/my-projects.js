'use strict';

angular.module('mean.project').controller('MyProjectsCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'Global', 
  function($scope,  $rootScope, $http, $location, $stateParams, Global) {
  	$scope.global = Global;
    if (!$scope.global.authenticated)
      return $location.url('/');

  	$scope.projects = [];
  	$scope.projectsError = null;

    var handledTasks = [];

  	$http.get('/projects', $scope.global.user)
  	  .success(function (res) {
        $scope.projects = res;
        calculateCompletion();
      })
      .error(function (error) {
        $scope.projectsError = error;

    });

    function calculateCompletion () {
      angular.forEach($scope.projects, function (project) {
        // console.log(project._id);
        project.tasks = [];
        project.totalTasks = 0;
        project.completedTasks = 0;
        project.completion = 0;
        
        angular.forEach(project.phases, function (phase) {
          $http.get('/projects/' + project._id + '/phases/' + phase + '/tasks', $scope.global.user)
          .success(function (res) {
            var tempTasks = [];
            angular.forEach(res, function (task) {
              var taskPhase = [];
              taskPhase.task = task;
              taskPhase.phase = phase;
              project.tasks.push(taskPhase);
              tempTasks.push(taskPhase);
            });

            angular.forEach(tempTasks, function (task) {
              if($.inArray(task.task, handledTasks) === -1) {
                $http.get('/projects/' + project._id + '/phases/' + task.phase + '/tasks/' + task.task, $scope.global.user)
                .success(function (res) {
                  project.totalTasks = project.tasks.length;
                  if(res.completed === true) 
                    project.completedTasks += 1;

                  project.completion = parseInt((project.completedTasks / project.totalTasks) * 100);
                  // console.log('Project ' + project._id + ' completion = ' + project.completion);
                })
                .error(function (error) {
                  $scope.projectsError = error;
                });
              }
            });
             
          })
          .error(function (error) {
            $scope.projectsError = error;
          });
        });
      });
    // console.log($scope.projects);
    }
}]);