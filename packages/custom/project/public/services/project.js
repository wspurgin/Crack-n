'use strict';

angular.module('mean.project').factory('Project', ['$resource', '$http',
  function($resource, $http) {
    return $resource('/projects/:projectId', {}, {
        query: {method: 'GET', params:{projectId: ''}, isArray:true},
        addMember: {method: 'POST',  url: '/projects/:projectId/members', isArray:false},
        removeMember: {method: 'DELETE', url: '/projects/:projectId/members/:memberId', isArray:false},
        changePermission: {method: 'PUT', url: '/projects/:projectId/members', isArray:false}
      });
  }
]);
