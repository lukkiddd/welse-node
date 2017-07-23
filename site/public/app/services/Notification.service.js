(function () {
	'use strict';

	angular
		.module('app')
		.service('Notification', NotificationService);

	NotificationService.$inject = ['$cookieStore', '$q', '$http'];
	
	function NotificationService($cookieStore, $q, $http) {
		var NOTIFICATION_URL = "https://welse-us.azurewebsites.net/api/db/notification";

		var notificationService = {
			getNotification: getNotification,
			readNotification: readNotification
		};
		return notificationService;

		function getNotification() {
			var defer = $q.defer();
			var token = $cookieStore.get('token');
			if (token) {
				token = token.replace(/["]+/g,'')
			}
			var data = {
				token: token
			}

			$http
				.post(NOTIFICATION_URL + '/', data)
				.then(function (data) {
					// console.log(data.data);
					defer.resolve(data.data);
				})
				.catch(function (error) {
					// console.log(error);
					defer.reject(error);
				});

			return defer.promise;
		}

		function readNotification(notification_id) {
			var defer = $q.defer();
			var token = $cookieStore.get('token');
			if (token) {
				token = token.replace(/["]+/g,'')
			}
			var data = {
				token: token,
				notification_id: notification_id
			}

			$http
				.post(NOTIFICATION_URL + '/read', data)
				.then(function (data) {
					// console.log(data.data);
					defer.resolve(data.data);
				})
				.catch(function (error) {
					// console.log(error);
					defer.reject(error);
				});
			
			return defer.promise;
		}
	}

})();