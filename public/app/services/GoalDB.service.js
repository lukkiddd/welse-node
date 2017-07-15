(function () {
	'use strict';

	angular
		.module('app')
		.service('Goal', GoalService);
	
	GoalService.$inject = ['$http', '$q', '$cookies'];

	function GoalService($http, $q, $cookies) {
		var GOAL_URL = "https://welse-app.azurewebsites.net/api/db/goals";
		var goalService = {
			set: set,
			remove: remove,
			get: get
		}
		return goalService;

		function set(goal) {
			var defer = $q.defer();
			var data = {
				token: $cookies.get('token'),
				name: goal.name,
				value: goal.value
			}

			$http
				.post(GOAL_URL + '/set', data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function (error) {
					console.log(error);
					defer.reject(error);
				});

			return defer.promise;
		}

		function remove(goal) {
			var defer = $q.defer();
			var data = {
				token: $cookies.get('token'),
				name: goal.name
			}

			$http
				.post(GOAL_URL + '/remove', data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function (error) {
					console.log(error);
					defer.reject(error);
				});

			return defer.promise;
		}

		function get() {
			var defer = $q.defer();
			var data = {
				token: $cookies.get('token')
			}

			$http
				.post(GOAL_URL, data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function (error) {
					console.log(error);
					defer.reject(error);
				});

			return defer.promise;
		}
	}

})();