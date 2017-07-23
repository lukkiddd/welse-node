(function() {
	'use strict';

	angular
			.module('app')
			.controller('loginCtrl', loginCtrl);

	loginCtrl.$inject = ['$scope', '$state', 'Users'];

	function loginCtrl($scope, $state, Users) {
		var vm = this;

		$scope.login = login;
		$scope.loading = false;

		isAuth();

		function isAuth() {
			if (Users.isLogin()) {
				$state.go('dashboard.me');
			}
		}

		function login(userData) {
			$scope.loading = true;
			Users
				.login(userData)
				.then(function () {
					$state.go('dashboard.me');
				})
				.catch(function () {
					swal("Sorry", "Incorrect username or password!", "error");
				});
		}


	}
})();
