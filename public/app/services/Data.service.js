(function() {
	'use strict';

	angular
			.module('app')
			.factory('Data', Data);

	Data.$inject = ['$q', '$http', '$cookies'];

	function Data($q, $http, $cookies) {
		var BASE_URL = "http://192.168.137.1:9000/api/v1";

		var data = {
			get: getDataByUser
		};
		return data;


		function getDataByUser(user) {
			var defer = $q.defer();
			var token = $cookies.get('token');
			if(!token) {
				defer.reject("NO TOKEN");
				return defer.promise;
			}

			console.log(user);
			console.log("== GET DATA");
			$http.get(BASE_URL + '/user/data/last?token=' + token + '&n=30&id='+user.id)
				.then(function(datas) {
					var data = _.map(datas, 'data')[0].Messages;
					console.log(data);

					data = _.forEach(data, function(val) {		
						return val.fromNow = moment(_.toInteger(val.datetime)).fromNow()
					})
					console.log(data);
					data = _.groupBy(data, function(val) {
						return val.topic
					})
					defer.resolve(data);
				})
				.catch(function(error) {
					console.log(error);
					defer.reject(error);
				})

			return defer.promise;
		}


	}
})();
