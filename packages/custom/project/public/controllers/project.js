'use strict';

angular.module('mean.project').controller('ProjectController', ['$scope', '$http', 'Users', 'Global', 'Project',
  function($scope, $http, Users, Global, Project) {
    $scope.global = Global;
    $scope.package = {
      name: 'project'
    };
  }
])
.controller('CreateProjectCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global', 'Users',
  function($scope,  $rootScope, $http, $location, Global, Users) {
    $scope.global = Global;
    if (!$scope.global.authenticated)
      return $location.url('/');

    // This will be the object filled in by the form data
    $scope.project = {};
    
    /* Extra initialization */
    // TODO: should not hard code permissions (they'll be used else-where)
    $scope.permissionLevels = ['admin', 'general', 'view_only'];

    // add starting current user as first admin user
    $scope.project.teamMembers = [
        {
            _id: $scope.global.user._id, 
            name: $scope.global.user.name,
            permission: $scope.permissionLevels[0]
        }
    ];

    // add starting current user as first admin user
    $scope.project.teamMembers = [
        {
            _id: $scope.global.user._id, 
            name: $scope.global.user.name,
            permission: $scope.permissionLevels[0]
        }
    ];
  }
])
.controller('TeamMemberCtrl', ['$scope', '$rootScope', '$http', 'Global',
  function($scope, $rootScope, $http, $location, Global){
    $scope.global = Global;
    $scope.searchText = '';
    $scope.searchUsersResults = [];

    // temp results
    $scope.searchUsersResults = [
      {
        email: 'tyler@me.com',
        name: 'Tyler George',
        _id: '5441c2346c46e2320714233a'
      },
      {
        email: 'will.spurgin@gmail.com',
        name: 'Will Spurgin',
        _id: '5441c2526c46e2320714233b'
      }];

      // This will be the object filled in by the form data
      $scope.project = {};
      
    $scope.searchForTeamMembers = function() {
      console.log('searchng with ' + $scope.searchText);
      return;
    };
}]);
