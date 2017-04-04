(function() {
	'use strict';

	angular
			.module('app')
			.controller('signupCtrl', signupCtrl);

	signupCtrl.$inject = ['$state', '$stateParams', 'Users'];

	function signupCtrl($state, $stateParams, Users) {
		var vm = this;

		/** Variables **/
		vm.errorMessage = "";
		vm.successMessage = "";
		vm.user = {};
		vm.user.type = $stateParams.type;

		/** Functions **/
		vm.signup = signup;

		function signup(user) {
			Users.signup(user)
				.then(function(data) {
					vm.successMessage = data.message;
					console.log(data);
					console.log("go");
					$state.go('dashboard-'+data.type);
				}, function(error) {
					console.log(error);
					vm.errorMessage = error.message;
				})
		}

	}
})();
