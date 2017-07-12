(function() {
	'use strict';

  angular
      .module('app')
      .directive('backButton', backButton);

    function backButton() {
        var directive = {
            restrict: 'EA',
            templateUrl: './app/directives/back-button.directive/back-button.tpl.html',
            controller: backButtonCtrl
        };
        return directive;
    }

    backButtonCtrl.$inject = ['$rootScope', '$state', '$scope'];

    function backButtonCtrl($rootScope, $state, $scope) {
        $scope.goBack = goBack;

        console.log($state);
        function goBack() {
            $state.go($rootScope.previousState.name, {uid: $state.params.uid});
        }
    }

})();

