(function () {
	'use strict';

	angular
		.module('app')
		.service('Friend', FriendService);
	
	FriendService.$inject = ['$http', '$q', '$cookies'];

	function FriendService($http, $q, $cookies) {
		var BASE_URL = "http://localhost:3000/api/db/friends";
		var friendService = {
			follow: follow,
			unfollow: unfollow,
			confirm: confirm,
			decline: decline,
			get: get
		}
		return friendService;

		function follow(follow_id) {
			var defer = $q.defer();

			var data = {
				token: $cookies.get('token'),
				follow_id: follow_id
			}

			$http
				.post(BASE_URL + '/follow', data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data.data);
				})
				.catch(function (error) {
					console.log(error);
					defer.reject(error);
				});

			return defer.promise;
		}

		function unfollow(follow_id) {
			var defer = $q.defer();

			var data = {
				token: $cookies.get('token'),
				follow_id: follow_id
			}

			$http
				.post(BASE_URL + '/unfollow', data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data.data);
				})
				.catch(function (error) {
					console.log(error);
					defer.reject(error);
				});

			return defer.promise;
		}

		function confirm(follow_id) {
			var defer = $q.defer();

			var data = {
				token: $cookies.get('token'),
				follow_id: follow_id
			}

			$http
				.post(BASE_URL + '/confirm', data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data.data);
				})
				.catch(function (error) {
					console.log(error);
					defer.reject(error);
				});

			return defer.promise;
		}

		function decline(follow_id) {
			var defer = $q.defer();

			var data = {
				token: $cookies.get('token'),
				follow_id: follow_id
			}

			$http
				.post(BASE_URL + '/decline', data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data.data);
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
				.post(BASE_URL, data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data.data);
				})
				.catch(function (error) {
					console.log(error);
					defer.reject(error);
				});

			return defer.promise;
		}
	}

})();