'use strict';

angular.module('mean.project').controller('MyProjectsCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'Global', 
  function($scope,  $rootScope, $http, $location, $stateParams, Global) {
  	$scope.global = Global;
    if (!$scope.global.authenticated)
      return $location.url('/');

  	$scope.projects = [];
    //$scope.tempTasks = [];
  	$scope.projectsError = null;

    var currentProjectID;

  	$http.get('/projects', $scope.global.user)
  	  .success(function (res) {
        $scope.projects = res;
        calculateCompletion();
        }
      )
      .error(function (error) {
        $scope.projectsError = error;
      });


      function calculateCompletion() {
        for(var i = 0; i < $scope.projects.length; i += 1) {
          console.log($scope.projects[i]);
          $scope.projects[i].tasks = [];
          $scope.projects[i].totalTasks = 0;
          $scope.projects[i].completedTasks = 0;
          currentProjectID = $scope.projects[i]._id;
          
          for(var j = 0; j < $scope.projects[i].phases.length; j += 1) { 
            getTasks(currentProjectID, $scope.projects[i].phases[j], i);
            $scope.projects[i].totalTasks = $scope.projects[i].tasks.length;
            alert('test');

            for(var k = 0; k < $scope.projects[i].tasks.length; k += 1) {
              alert('test'); 
              getTask(currentProjectID, $scope.projects[i].phases[j], $scope.projects[i].tasks[k], i);
            }

          }

          
        }
      }

          // $scope.projects[i].completetion = ($scope.projects[i].completedTasks / $scope.projects[i].totalTasks) * 100;
          // console.log('Project ' + currentProjectID + ' completion = ' + ($scope.projects[i].completedTasks / $scope.projects[i].totalTasks) * 100 + '%');
          

      function getTasks(projectID, phaseID, projectIndex) {
        $http.get('/projects/' + projectID + '/phases/' + phaseID + '/tasks', $scope.global.user)
          .success(function (res) {
            console.log('Tasks for ' + projectID + ': ' + res);
            for(var i = 0; i < res.length; i += 1) {
              $scope.projects[projectIndex].tasks.push(res[i]);
            }
          })
          .error(function (error) {
            $scope.projectsError = error;
          });
      }

      function getTask(projectID, phaseID, taskID, projectIndex) {
        $http.get('/projects/' + projectID + '/phases/' + phaseID + '/tasks/' + taskID, $scope.global.user)
          .success(function (res) {
            console.log('Task info: ' + res);
          })
          .error(function (error) {
            $scope.projectsError = error;
          });
      }

}]);