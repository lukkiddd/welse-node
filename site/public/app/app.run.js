(function() {
	'use strict';

	var config = {
    apiKey: "AIzaSyBsXQ4ZjWB1C0dumOVK8tNZf8MlNcMauqc",
    authDomain: "welse-dashboard.firebaseapp.com",
    databaseURL: "https://welse-dashboard.firebaseio.com",
    projectId: "welse-dashboard",
    storageBucket: "welse-dashboard.appspot.com",
    messagingSenderId: "550064434282"
	};
	firebase.initializeApp(config);

	angular
			.module('app')
			.run(appRun);

	appRun.$inject = ['$rootScope'];

	function appRun($rootScope) {

		moment.locale('en');
		Highcharts.setOptions({
			global: {
				useUTC: false
			}
		});


		$rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
        $rootScope.previousState = from;
    });
		
	}
})();
