(function() {
  'use strict';

  angular
    .module('app')
    .directive('profile', profile);

  function profile() {
    var directive = {
      restrict: 'EA',
      templateUrl: './app/directives/profile.directive/profile.tpl.html',
      controller: profileCtrl,
      controllerAs: 'vm',
      bindToController: true
    };
    
    return directive;
  }

  profileCtrl.$inject = ['Auth', 'Users', '$scope']

  function profileCtrl(Auth, Users, $scope) {
    $scope.profile = {
      toggle: function() {
        this._show = !this._show;
      },
      show: function() {
        this._show = true;
      },
      hide: function() {
        this._show = false;
      },
      _show: false,
    }

    Auth.$onAuthStateChanged(function(authData) {
      if(authData) {
        Users
          .get(authData)
          .$loaded()
          .then(function(user) {
            $scope.me = user;
          });
      }
    });
  }

})();
