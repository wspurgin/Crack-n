'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', 'Global', 'Menus',
  function($scope, $rootScope, Global, Menus) {
    $scope.global = Global;
    $scope.menus = {};

    // Default hard coded menu items for main menu
    var defaultMainMenu = [];

    // Query menus added by modules. Only returns menus that user is allowed to see.
    function queryMenu(name, defaultMenu) {

      Menus.query({
        name: name,
        defaultMenu: defaultMenu
      }, function(menu) {
        $scope.menus[name] = menu;
      });
    }

    // Query server for menus and check permissions
    queryMenu('main', defaultMainMenu);

    $scope.isCollapsed = false;

    $rootScope.$on('loggedin', function() {

      queryMenu('main', defaultMainMenu);

      $scope.global = {
        authenticated: !! $rootScope.user,
        user: $rootScope.user
      };
      window.location.reload();
    });

  }
])
.controller('LoginController', ['$scope', '$rootScope', '$http', '$location', 'Global',
  function($scope, $rootScope, $http, $location, Global) {
    // This object will be filled by the form
    $scope.user = {};
    $scope.global = Global;
    $scope.global.registerForm = false;
    $scope.loginError = false;
    $scope.input = {
      type: 'password',
      placeholder: 'Password',
      confirmPlaceholder: 'Repeat Password',
      iconClass: '',
      tooltipText: 'Show password'
    };

    // Register the login() function
    $scope.login = function() {
      $http.post('/login', {
        email: $scope.user.email,
        password: $scope.user.password
      })
        .success(function(response) {
          // authentication OK
          $scope.loginError = 0;
          $rootScope.user = response.user;
          $rootScope.$emit('loggedin');
          if (response.redirect) {
            if (window.location.href === response.redirect) {
              //This is so an admin user will get full admin page
              window.location.reload();
            } else {
              window.location = response.redirect;
            }
          } else {
            window.location.reload();
          }
        })
        .error(function() {
          $scope.loginError = 'Username and/or Password are invalid.';
        });
    };
  }
]);

