(function() {
	'use strict';

	angular
			.module('app')
			.controller('loginCtrl', loginCtrl);

	loginCtrl.$inject = ['$state', 'Users'];

	function loginCtrl($state, Users) {
		var vm = this;

		vm.errorMessage = "";
		vm.loading = false;

		/* Authentication */
		// Auth.$onAuthStateChanged(function(authData) {
		// 	vm.authData = authData;
		// 	if(vm.authData) {
		// 		vm.user = Users.get(vm.authData);
		// 		vm.user.$loaded()
		// 			.then(function(user) {
		// 				$state.go('dashboard-'+user.type);
		// 			})
		// 	}
		// })

		vm.login = function(userData) {
			console.log(userData);
			vm.loading = true;
			Users.login(userData)
				.then(function(data) {
					// $state.go('dashboard-user');
					vm.loading = false;
				}).catch(function(error) {
					vm.errorMessage = error.message;
					vm.loading = false;
				})
		}


	}
})();
