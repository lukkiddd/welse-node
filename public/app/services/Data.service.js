(function() {
	'use strict';

	angular
			.module('app')
			.factory('Data', Data);

	Data.$inject = ['$q', '$firebaseArray', '$firebaseObject', 'Auth'];

	function Data($q, $firebaseArray, $firebaseObject, Auth) {
		var dataRef = firebase.database().ref().child('health');

		var data = {
			get: getDataByUser,
		};
		return data;

		function getDataByUser(authData) {
			var defer = $q.defer();

			var dataItem = $firebaseArray(dataRef.child(authData.uid));

			dataItem.$loaded()
				.then(function(datas) {
					var data = _.orderBy(datas, 'timestamp', 'asc');
					data = _.forEach(data, function(val) {		
						return val.timeAgo = moment.unix(_.toInteger(val.timestamp)).fromNow()
					})
					data = _.groupBy(data, 'name');
					
					var hasVal = {};
					_.forEach(data, (key) => {
						if (key[0].value) {
							hasVal[key[0].name] = key;
						}
					});
					var retval = hasVal;

					_.forIn(retval, function(value, key) {
						retval[key] = _.takeRight(value, 20);
					});

					defer.resolve(retval);
				})
				.catch(function(error) {

					defer.reject(error);
				})

			return defer.promise;
		}

	}
})();
