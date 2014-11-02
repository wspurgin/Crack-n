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
    $scope.createError = false;

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

    function validProject() {
      $scope.createError = false;
      if ($scope.project.name === undefined) {
        $scope.createError = 'Project must have a name';
        return false;
      }
      return true;
    }

    $scope.createProject = function() {
      event.preventDefault();
      if(validProject()) {
        $http.post('/projects', $scope.project)
          .success(function(res) {
            console.log(res);
            $location.url('/project/'+res._id);
          })
          .error(function() {
            alert('Could not create your project. Check network connection and try again');
          });
      }
    };

    // if the browser isn't chrome, use jquery-ui for input type date
    if (!window.chrome) {
      if($('input[type=date]')) {
        $('input[type=date]').each(function() {
          $(this).datepicker().datepicker('option', 'dateFormat', 'yy-mm-dd');
        });
      }
    }
  }
])
.controller('TeamMemberCtrl', ['$scope', '$rootScope', '$http', 'Global',
  function($scope, $rootScope, $http, $parent, Global){
    $scope.global = Global;
    $scope.searchText = '';
    $scope.searchError = false;
    $scope.searchUsersResults = [];

    function arrayObjectIndexOf(arr, obj){
      for(var i = 0; i < arr.length; i+=1){
          if(arr[i]._id === obj._id){
              return i;
          }
      }
      return false;
    }

    function filterResults() {
      $scope.project.members.forEach(function (member) {
        var index = arrayObjectIndexOf($scope.searchUsersResults, member);
        if (index !== false) {
          // remove existing members from results
          $scope.searchUsersResults.splice(index, 1);
        }
      });
    }

    $scope.searchForTeamMembers = function() {
      if(!!$scope.searchText) {
        $http({
          url: '/users',
          method: 'GET',
          params: {q: $scope.searchText}
        })
          .success(function(res) {
            $scope.searchError = false;
            $scope.searchUsersResults = res;
            if (!res.length) {
              $scope.searchError = 'No results found';
            } else {
              filterResults();
            }
          })
          .error(function() {
            $scope.searchError = 'Errors occured making your request :(';
          });
      }
    };

    $scope.removeTeamMember = function(member) {
      $scope.project.members.splice(member, 1);
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
