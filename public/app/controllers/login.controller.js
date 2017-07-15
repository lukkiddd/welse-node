(function() {
	'use strict';

	angular
			.module('app')
			.controller('loginCtrl', loginCtrl);

	loginCtrl.$inject = ['$state', 'Users'];

	function loginCtrl($state, Users) {
		var vm = this;

		vm.errorMessage = "";
		vm.login = login;
		vm.loading = false;

		isAuth();

		function isAuth() {
			if (Users.isLogin()) {
				$state.go('dashboard.me');
			}
		}

		function login(userData) {
			vm.loading = true;
			Users
				.login(userData)
				.then(function () {
					$state.go('dashboard.me');
				});
		}


	}
})();
