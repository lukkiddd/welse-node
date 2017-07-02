(function (){
	'use strict';

	angular
		.module('app')
		.controller('ihealthCtrl', ihealthCtrl);

	ihealthCtrl.$inject = ['$state', '$stateParams', '$http', 'Auth'];

	function ihealthCtrl($state, $stateParams, $http, Auth) {

		var BASE_URL = 'http://localhost:3000'

		Auth.$onAuthStateChanged(function(authData) {
			var uid = authData.uid;
			var accessToken = $stateParams.accessToken;
			var userId = $stateParams.userId;

			if(uid && accessToken && userId) {
				var url = BASE_URL + '/api/ihealth/user';

				$http.get(url + '/?uid=' + uid + '&accessToken=' + accessToken + '&userId=' + userId )
					.then(function(data) {
						console.log(data);
					})
			} else {
				alert('Error');
				console.log(uid);
				console.log(accessToken);
				console.log(userId);
			}

		});
	}
})();