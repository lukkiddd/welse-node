(function () {
	'use strict';

	angular
		.module('app')
		.service('Health', HealthService);

	HealthService.$inject = ['$http', '$q', '$cookieStore'];

	function HealthService($http, $q, $cookieStore) {
		var HEALTH_URL = "http://localhost:3000/api/db/health";
		var healthService = {
			getHealth: getHealth,
			getHealthUser: getHealthUser
		};
		return healthService;

		function getHealth() {
			var defer = $q.defer();
			var data = {
				token: $cookieStore.get('token').replace(/["]+/g,'')
			}
			$http
				.post(HEALTH_URL, data)
				.then(function (data) {
					// console.log(data.data);
					defer.resolve(data.data);
				})
				.catch(function (err) {
					// console.log(err);
					defer.reject(err);
				});

			return defer.promise;
		}

		function getHealthUser(userId) {
			var defer = $q.defer();
			var data = {
				_id: userId
			};

			$http
				.post(HEALTH_URL + '/user', data)
				.then(function (data) {
					defer.resolve(data.data);
				})
				.catch(function (data) {
					defer.reject(data.data);
				});
			return defer.promise;
		}

	}
	
})();