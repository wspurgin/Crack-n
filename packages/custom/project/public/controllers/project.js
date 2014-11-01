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

    // make current user the project owner
    $scope.project.owner = $scope.global.user._id;

    // add starting current user as first admin user
    $scope.project.members = [
        {
            _id: $scope.global.user._id,
            name: $scope.global.user.name,
            permission: $scope.permissionLevels[0]
        }
    ];

    $scope.createProject = function() {
      $http.post('/projects', $scope.project)
        .success(function(res) {
          console.log(res);
          $location.url('/project/'+res._id);
        })
        .error(function() {
          alert('Could not create your project. Check network connection and try again');
        });
    };

    // if the browser isn't chrome, use jquery-ui for input type date
    if (!window.chrome) {
      if($('input[type=date]')) {
        $('input[type=date]').each(function() {
          $(this).datepicker();
        });
      }
    }
  }
])
.controller('TeamMemberCtrl', ['$scope', '$rootScope', '$http', 'Global',
  function($scope, $rootScope, $http, $parent, Global){
    $scope.global = Global;
    $scope.searchText = '';
    $scope.searchUsersResults = [];

    function arrayObjectIndexOf(arr, obj){
    for(var i = 0; i < arr.length; i+=1){
        if(angular.equals(arr[i], obj)){
            return i;
        }
    }
      return false;
    }

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
      
    $scope.searchForTeamMembers = function() {
      console.log('searchng with ' + $scope.searchText);
        return;
    };

    $scope.addTeamMember = function(member) {
      event.preventDefault();
      $scope.project.members.push({
        _id: member._id,
        name: member.name,
        permission: $scope.permissionLevels[$scope.permissionLevels.indexOf('general')]
      });
      $scope.searchUsersResults.splice(arrayObjectIndexOf($scope.searchUsersResults, member), 1);
    };
}])
.directive('crnTeamModifer', function(){
  // Runs during compile
  return {
    restrict: 'A',
    templateUrl: 'project/views/team-finder.html'
  };
});
