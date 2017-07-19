(function() {
	'use strict';

	angular
			.module('app')
			.controller('mainPageCtrl', mainPageCtrl);

	mainPageCtrl.$inject = ['$scope', '$state', '$interval', 'Users', 'Notification'];

	function mainPageCtrl($scope, $state, $interval, Users, Notification) {
		var vm = this;

		$scope.logout = logout;
		$scope.readNoti = readNoti;
		$scope.notiUnread = false;
		$interval(function () {
			getNotification();
		}, 3000);

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
					$scope.notifications = data;
					$scope.notiUnread = _.filter(data, function (val) {
						return val.read === false;
					});
					console.log($scope.notiUnread);
				})
				.catch(function (error) {
					if(!$scope.notifications) {
						getNotification();
					}
				}) 
		}

		function readNoti(noti) {
			Notification
				.readNotification(noti._id)
				.then(function (data) {
					getNotification();
				})
				.catch(function (error) {
					console.log(error);
					readNoti(noti);
				})
		}

	}
})();
