(function () {
	'use strict';

	angular
		.module('app')
		.service('Goal', GoalService);
	
	GoalService.$inject = ['$http', '$q', '$cookies'];

	function GoalService($http, $q, $cookies) {
		var GOAL_URL = "https://welse-us-azure.azurewebsites.net/api/db/goals";
		var goalService = {
			setGoal: setGoal,
			setGoalUser: setGoalUser,
			remove: remove,
			getGoal: getGoal,
			getGoalUser: getGoalUser
		}
		return goalService;

		function setGoal(goal) {
			var defer = $q.defer();
			var data = {
				token: $cookies.get('token').replace(/["]+/g,''),
				name: goal.name,
				value: goal.value
			}
			// console.log(data);

			$http
				.post(GOAL_URL + '/set', data)
				.then(function (data) {
					defer.resolve(data.data);
				})
				.catch(function (error) {
					// console.log(error);
					defer.reject(error);
				});

			return defer.promise;
		}

		function setGoalUser(goal, id) {
			var defer = $q.defer();
			var data = {
				_id: id,
				name: goal.name,
				value: goal.value
			}

			$http
				.post(GOAL_URL + '/set/user', data)
				.then(function (data) {
					defer.resolve(data.data);
				})
				.catch(function (error) {
					// console.log(error);
					defer.reject(error);
				});

			return defer.promise;
		}

		function remove(goal) {
			var defer = $q.defer();
			var data = {
				token: $cookies.get('token').replace(/["]+/g,''),
				name: goal.name
			}

			$http
				.post(GOAL_URL + '/remove', data)
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

		function getGoal() {
			var defer = $q.defer();
			var data = {
				token: $cookies.get('token').replace(/["]+/g,''),
			}

			$http
				.post(GOAL_URL, data)
				.then(function (data) {
					defer.resolve(data.data);
				})
				.catch(function (error) {
					// console.log(error);
					defer.reject(error);
				});

			return defer.promise;
		}

		function getGoalUser(id) {
			var defer = $q.defer();
			var data = {
				_id: id
			}
			$http
				.post(GOAL_URL + '/user', data)
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