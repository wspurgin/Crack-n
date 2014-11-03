'use strict';

angular.module('mean.project').controller('CreateTaskCtrl', ['$scope', '$rootScope', '$http', 'Global',
  function($scope, $rootScope, $http, Global) {
    $scope.global = Global;
    // will be filled out by form.
    $scope.task = {};

    $scope.createTask = function() {
      if($scope.task.name === undefined) {
        alert('Task needs a name');
      } else {
        console.log($scope.phase);
        console.log($scope.task);
        $http.post('/projects/' + $scope.project._id + '/phases/' + $scope.phase._id + '/tasks', $scope.task)
          .success(function (res) {
            $scope.phase.tasks.push(res);
            $scope.task = {};
          })
          .error(function() {
            alert('Could not create task :(');
          });
      }
    };
}]);