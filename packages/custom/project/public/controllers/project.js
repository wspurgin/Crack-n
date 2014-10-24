'use strict';

angular.module('mean.project').controller('ProjectController', ['$scope', 'Global', 'Project',
  function($scope, Global, Project) {
    $scope.global = Global;
    $scope.package = {
      name: 'project'
    };
  }
])
.controller('CreateProjectCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
    function($scope, $rootScope, $http, $location, Global) {
        $scope.global = Global;

        // This will be the object filled in by the form data
        $scope.project = {};
        
        /* Extra initialization */
        // TODO: should not hard code permissions (they'll be used else where)
        $scope.permissionLevels = ['admin', 'general', 'view_only'];

        // add starting current user as first admin user
        $scope.project.teamMembers = [
            {
                _id: $rootScope.user._id, 
                name: $rootScope.user.name,
                permission: $scope.permissionLevels[0]
            }
        ];
    }
]);
