'use strict';

angular.module('mean.project').controller('CreatePhaseCtrl', ['$scope', '$rootScope', '$http', 'Global',
  function($scope, $rootScope, $http, Global) {
    $scope.global = Global;
    // will be filled out by form.
    $scope.phase = {};

    $scope.createProject = function() {
      if($scope.phase.name === undefined) {
        alert('Phase needs a name');
      } else {

        $http.post('/projects/' + $scope.project._id + '/phases')
          .success(function (res) {
            $scope.project.push(res);
            $scope.phase = {};
          });
      }
    };
}]);