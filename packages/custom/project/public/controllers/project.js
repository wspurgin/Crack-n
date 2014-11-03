'use strict';

angular.module('mean.project').controller('ProjectCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'Global', 
  function($scope,  $rootScope, $http, $location, $stateParams, Global) {
    $scope.global = Global;
    if (!$scope.global.authenticated)
      return $location.url('/');
    $scope.project = {};

    function findCurrentMember() {
      for (var i = $scope.project.members.length - 1; i >= 0; i-=1) {
        if($scope.project.members[i]._id === $scope.global.user._id)
          return $scope.project.members[i];
      }
      return false;
    }

    function getProject() {
      $http.get('/projects/' + $stateParams.projectId)
        .success(function (res) {
          $scope.project = res;

          // test for empty response
          if (!Object.keys($scope.project).length)
            // for now reroute to home but we should reroute to a custom 404
            $location.url('/');

          // determine the current user's membership on project.
          $scope.currentMember = findCurrentMember();
          if ($scope.currentMember === false)
            // they aren't allowed to see this project
            $location.url('/');
        })
        .error(function () {
          alert('Could not retrieve project :(');
        });
    }
    getProject();
  }
])
.controller('CreateProjectCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
  function($scope,  $rootScope, $http, $location, Global) {
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

          // if the results are now empty
          if (!$scope.searchUsersResults.length)
              $scope.searchError = 'No results found';
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
.controller('MessageBoardCtrl', ['$scope', '$rootScope', '$http', '$stateParams', 'Global',
  function($scope, $rootScope, $http, $stateParams, Global) {
    $scope.global = Global;
    $scope.messageError = false;
    $scope.messages = [];
    $scope.message = {};
    var user = $scope.global.user;

    $http.get('/projects/' + $stateParams.projectId + '/messages')
      .success(function (res) {
        console.log(res);
        $scope.messages = res;
      })
      .error(function (error) {
        $scope.messageError = error;
      });

    $scope.addMessage = function () {
      $scope.message.user = user;

      $http.post('/projects/' + $stateParams.projectId + '/messages', $scope.message)
        .success(function (res) {
          console.log('Message added successfully');
        })
        .error(function (error) {
          $scope.messageError = error;
        });
    };


}])
.directive('crnMessageBoard', function () {
  return {
    restrict: 'A',
    templateUrl: 'project/views/message-board.html'
  };
})
.directive('crnTeamModifer', function(){
  // Runs during compile
  return {
    restrict: 'A',
    templateUrl: 'project/views/team-finder.html'
  };
});
