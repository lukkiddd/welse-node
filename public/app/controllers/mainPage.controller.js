(function() {
	'use strict';

	angular
			.module('app')
			.controller('mainPageCtrl', mainPageCtrl);

	mainPageCtrl.$inject = ['$scope', '$state', 'Users'];

	function mainPageCtrl($scope, $state, Users) {
		var vm = this;

		$scope.logout = logout;

		function logout() {
			Users
				.logout()
				.then(function () {
					$state.go('login');
				})
				.catch(function (error) {
					console.log(error);
				})
		}

	}
})();
