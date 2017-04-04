(function() {
	'use strict';

	// var config = {
	//   apiKey: 'AIzaSyB81xt3uWE4xqNkRfF7ovFNIdT1b8F2vFo',
	//   authDomain: 'welse-141512.firebaseapp.com',
	//   databaseURL: 'https://welse-141512.firebaseio.com/',
	//   storageBucket: 'gs://welse-141512.appspot.com'
	// };
	// firebase.initializeApp(config);

	angular
			.module('app')
			.run(appRun);

	appRun.$inject = ['$rootScope'];

	function appRun($rootScope) {

		moment.locale('th');
		Highcharts.setOptions({
			global: {
				useUTC: false
			}
		})
	}
})();
