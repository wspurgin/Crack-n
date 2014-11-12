'use strict';

angular.module('mean.project').controller('MyProjectsCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'Global', 
  function($scope,  $rootScope, $http, $location, $stateParams, Global) {
  	$scope.global = Global;
    if (!$scope.global.authenticated)
      return $location.url('/');

  	$scope.projects = [];
  	$scope.projectsError = null;

  	$http.get('/projects', $scope.global.user)
  	  .success(function (res) {
        $scope.projects = res;
      })
      .error(function (error) {
        $scope.projectsError = error;

      });
}]);