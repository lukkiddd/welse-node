(function () {
	'use strict';

	angular
		.module('app')
		.service('Health', HealthService);

	HealthService.$inject = ['$http', '$q'];

	function HealthService($http, $q) {
		var HEALTH_URL = "https://welse-app.azurewebsites.net/api/db/health";
		var healthService = {
			get: get
		};
		return healthService;

		function get(token) {
			var defer = $q.defer();
			$http
				.get(HEALTH_URL, data)
				.then(function (data) {
					console.log(data);
					// MomentJS
					// Arrange data
					defer.resolve(data);
				})
				.catch(function (err) {
					defer.reject(err);
				});
			return defer.promise;
		}

	}
	
})();