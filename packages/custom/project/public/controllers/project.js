'use strict';

angular.module('mean.project').controller('ProjectCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', '$interval', 'Global', 'Project', 
  function($scope,  $rootScope, $http, $location, $stateParams, $interval, Global, Project) {
    $scope.global = Global;
    if (!$scope.global.authenticated)
      return $location.url('/');
    $scope.project = {};
    $scope.editingMembers = false;

    $scope.permissionLevels = ['admin', 'general', 'view_only'];

    $scope.Project = Project;

    function findCurrentMember() {
      for (var i = $scope.project.members.length - 1; i >= 0; i-=1) {
        if($scope.project.members[i]._id === $scope.global.user._id)
          return $scope.project.members[i];
      }
      return false;
    }

    function getProject() {
      console.log('getting project');
      Project.get({projectId: $stateParams.projectId},
        function(project) {
          $scope.project = project;

          // test for empty response
          if (!Object.keys($scope.project).length)
            // for now reroute to home but we should reroute to a custom 404
            $location.url('/');

          // determine the current user's membership on project.
          $scope.currentMember = findCurrentMember();
          if ($scope.currentMember === false)
            // they aren't allowed to see this project
            $location.url('/');
      },
      function(error) {
        console.log(error);
        alert('Could not retrieve project :(');
      });
    }
    getProject();
    var stop = $interval(getProject, 1000*20);

    $scope.$on('destory', function() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    });
  }
])
.controller('CreateProjectCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
  function($scope,  $rootScope, $http, $location, Global) {
    $scope.global = Global;
    $scope.projectCreationForm = true;
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
.controller('TeamMemberCtrl', ['$scope', '$rootScope', '$http', '$stateParams', 'Global',
  function($scope, $rootScope, $http, $stateParams, $parent, Global){
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

      // if we aren't on the project creation form
      if(!$scope.projectCreationForm) {
        if(verifyRemoval(member))
          $scope.Project.removeMember({projectId: $scope.project._id ? $scope.project._id : $stateParams.projectId}, member._id);
        else
          return;
      }
      $scope.project.members.splice(member, 1);
    };

    $scope.addTeamMember = function(member) {
      event.preventDefault();
      var i = $scope.project.members.push({
        _id: member._id,
        name: member.name,
        permission: $scope.permissionLevels[$scope.permissionLevels.indexOf('general')]
      });
      $scope.searchUsersResults.splice(arrayObjectIndexOf($scope.searchUsersResults, member), 1);
      if(!$scope.projectCreationForm)
        $scope.Project.addMember({projectId: $scope.project._id ? $scope.project._id : $stateParams.projectId}, $scope.project.members[i-1]);
    };

    function verifyRemoval(targetedMember) {
      // when this function is called, by contract, we exprect the $scope variables to be instantiated.
      // is the currentMember an admin?
      if ($scope.currentMember.permission !== 'admin') {
        return false;
      }

      if (targetedMember._id === $scope.project.owner) {
        if($scope.currentMember._id === $scope.project.owner)
          alert('You\'re the owner of this project! The owner cannot be removed.');
        else
          alert('The owner of the project cannot be removed.');
        return false;
      }

      if ($scope.currentMember === targetedMember) {
        // make sure you aren't the last admin standing
        if(!isLastAdminStanding(targetedMember)) {
          var choice = confirm('You\'re removing yourself, are you sure?');
          if (!choice)
            return false;
        }
        else {
          alert('You are the last admin in the project, elevate someone else to \'admin\' status before removing yourself.');
          return false;
        }
      }
      return true;
    }

    function isLastAdminStanding(targetedMember) {
      // make sure you aren't the last admin standing
      var lastAdminStanding = true;
      $scope.project.members.forEach(function(member) {
        if(member !== targetedMember && member.permission === 'admin')
          lastAdminStanding = false;
      });
      return lastAdminStanding;
    }
}])
.controller('MessageBoardCtrl', ['$scope', '$rootScope', '$http', '$stateParams', '$interval', 'Global',
  function($scope, $rootScope, $http, $stateParams, $interval, Global) {
    $scope.global = Global;
    $scope.messageError = false;
    $scope.messages = [];
    $scope.message = {};
    $http.get('/projects/' + $stateParams.projectId + '/messages')
      .success(function (res) {
        $scope.messages = res;
      })
      .error(function (error) {
        $scope.messageError = error;
      });

      $('.messagesDisplay').animate({
            scrollTop: $('.messagesDisplay').get(0).scrollHeight
            }, 1500);

    $scope.addMessage = function () {
      $scope.message.user_id = $scope.global.user._id;
      $scope.message.username = $scope.global.user.username;
      $scope.message.project_id = $stateParams.projectId;

      $http.post('/projects/' + $stateParams.projectId + '/messages', $scope.message)
        .success(function (res) {
          $scope.messages.push(res);
          $('[name="post_message"]').val('');
          $('.messagesDisplay').animate({
            scrollTop: $('.messagesDisplay').get(0).scrollHeight
            }, 1500);
        })
        .error(function (error) {
          $scope.messageError = error;
        });
    };

    function poll(){
      setTimeout(function(){
        
        $http.get('/projects/' + $stateParams.projectId + '/messages')
          .success(function (res) {
            $scope.messages = res;
          })
          .error(function (error) {
            $scope.messageError = error;
          });

          $('.messagesDisplay').animate({
            scrollTop: $('.messagesDisplay').get(0).scrollHeight
          }, 1500);
      }, 1000);
    }

    var stop = $interval(poll, 1000*8);

    $scope.$on('destory', function() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    });

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
