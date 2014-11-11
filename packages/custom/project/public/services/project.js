'use strict';

angular.module('mean.project').factory('Project', ['$resource', '$http',
  function($resource, $http) {
    return $resource('/projects/:projectId', {}, {
        query: {method: 'GET', params:{projectId: ''}, isArray:true}
      });
  }
]);
