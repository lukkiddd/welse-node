(function() {
	'use strict';

	angular
			.module('app')
			.controller('mainPageCtrl', mainPageCtrl);

	mainPageCtrl.$inject = ["$window", "$scope", "$state", "$interval", "Users", "$cookies"];

	function mainPageCtrl($window, $scope, $state, $interval, Users, $cookies) {
		var vm = this;
		vm.logout = logout;
		vm.gotoMain = gotoMain;
		$scope.isMobile = false;
		$scope.ready = true;

		$scope.$watch(function() {
			return $cookies.get('token');
		}, function(newValue) {
        isLogin();
    });

		function isLogin() {
			Users.get()
				.then(function(user) {
					console.log(user);
					vm.me = user;
					gotoMain();
				}).catch(function(error) {
					console.log(error);
				})
		}

		function gotoMain() {
			console.log('dashboard-'+vm.me.type);
			$state.go('dashboard-'+vm.me.type);
		}

		function logout() {
			Users.logout()
				.then(function(data) {
					console.log(data);
					$state.go('login');
				})
		}

		/** Private Function **/
		var tick = function() {
			vm.clock = Date.now();
		}
		tick();
		$interval(tick, 1000);
		/** END **/

		/** MOBILE RESIZE **/
		var w = angular.element($window);
		if(w[0].innerWidth < 768) {
			$scope.isMobile = true;
		} else {
			$scope.isMobile = false;
		}
    w.on('resize', function() {
			if(w[0].innerWidth < 768) {
				$scope.isMobile = true;
				$scope.$apply();
			} else {
				$scope.isMobile = false;
				$scope.$apply();
			}
    });
	}
})();
