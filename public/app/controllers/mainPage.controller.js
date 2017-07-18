(function() {
	'use strict';

	angular
			.module('app')
			.controller('mainPageCtrl', mainPageCtrl);

	mainPageCtrl.$inject = ['$scope', '$state', 'Users', 'Notification'];

	function mainPageCtrl($scope, $state, Users, Notification) {
		var vm = this;

		$scope.logout = logout;
		$scope.readNoti = readNoti;
		$scope.notiUnread = false;
		getNotification();

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

		function getNotification() {
			Notification
				.getNotification()
				.then(function (data) {
					// console.log(data);
					$scope.notifications = data;
					$scope.notiUnread = _.filter(data, function (val) {
						return val.read === false;
					});
					console.log($scope.notiUnread);
				})
				.catch(function (error) {
					// console.log(error);
					if(!$scope.notifications) {
						getNotification();
					}
				}) 
		}

		function readNoti(noti) {
			Notification
				.readNotification(noti._id)
				.then(function (data) {
					// console.log(data);
				})
				.catch(function (error) {
					console.log(error);
					readNoti(noti);
				})
		}

	}
})();
