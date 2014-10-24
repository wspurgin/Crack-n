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
        console.log($scope.global);
        // This will be the object filled in by the form data
        $scope.project = {};
        
        /* Extra initialization */
        // TODO: should not hard code permissions (they'll be used else where)
        $scope.permissionLevels = ['admin', 'general', 'view_only'];

        // add starting current user as first admin user
        $scope.project.teamMembers = [
            {
                _id: $scope.global.user._id, 
                name: $scope.global.user.name,
                permission: $scope.permissionLevels[0]
            }
        ];
    }
]);
