'use strict';

angular.module('mean.project').controller('CreatePhaseCtrl', ['$scope', '$rootScope', '$http', 'Global',
  function($scope, $rootScope, $http, Global) {
    $scope.global = Global;
    // will be filled out by form.
    $scope.phase = {};

    $scope.createPhase = function() {
      if($scope.phase.name === undefined) {
        alert('Phase needs a name');
      } else {
        console.log($scope.phase);
        $http.post('/projects/' + $scope.project._id + '/phases', $scope.phase)
          .success(function (res) {
            $scope.project.phases.push(res);
            $scope.phase = {};
          })
          .error(function() {
            alert('Could not create phase :(');
          });
      }
    };
}])
.controller('PhaseCtrl', ['$scope', '$rootScope', '$http', 'Global', 
  function($scope, $rootScope, $http, Global) {
    $scope.global = Global;
    $scope.editingPhase = false;
    
    $scope.addPhase = function() {
      $('#addPhaseForm input:first-child').focus();
    };

    $scope.deletePhase = function(phase) {
      if ($scope.currentMember.permission === 'admin') {
        $http.delete('/projects/' + $scope.project._id + '/phases/' + $scope.phase._id)
          .success(function(res) {
            // remove task from model data
            $scope.project.phases.pop($scope.arrayObjectIndexOf($scope.project.phases, phase));
          })
          .error(function() {
            alert('Could not delete phase :(');
          });
      }
    };

    $scope.editPhase = function(phase) {
      $http.put('/projects/' + $scope.project._id + '/phases/' + $scope.phase._id, $scope.phase)
      .success(function(res) {
        $scope.editingPhase = false;
      })
      .error(function() {
        alert('Could not change the phase to' + $scope.phase.name + ' :(');
      });
    };
}])
.directive('crnPhase', function(){
  return {
    restrict: 'A',
    templateUrl: 'project/views/phase.html'
  };
});