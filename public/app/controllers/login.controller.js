(function() {
	'use strict';

	angular
			.module('app')
			.controller('loginCtrl', loginCtrl);

	loginCtrl.$inject = ['$state', 'Users', 'Auth'];

	function loginCtrl($state, Users, Auth) {
		var vm = this;

		vm.errorMessage = "";
		vm.login = login;
		vm.loading = false;

		/* Authentication */
		Auth.$onAuthStateChanged(function(authData) {
			vm.authData = authData;
			if(vm.authData) {
				vm.user = Users.get(vm.authData);
				vm.user.$loaded()
					.then(function(user) {
						$state.go('dashboard.me');
					})
			}
		})

		function login(userData) {
			vm.loading = true;
			Users.login(userData)
				.then(function() {
					$state.go('dashboard.me');
					vm.loading = false;
				})
				.catch(function() {
					vm.errorMessage = "รหัสผ่านไม่ถูกต้อง หรือ ไม่ได้เป็นสมาชิก";
					vm.loading = false;
				})
		}


	}
})();
