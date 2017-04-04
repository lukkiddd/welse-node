(function() {
	'use strict';

	angular
			.module('app')
			.factory('WebSocket', WebSocket);

	WebSocket.$inject = ['$q', '$http', '$websocket'];

	/***
	 ref: https://github.com/AngularClass/angular-websocket
	**/
	function WebSocket($q, $http) {
		var webSocket = {
			getDataByPatientId: getDataByPatientId
		};
		return webSocket;

		var WEBSOCKET_URI = 'ws://website.com/data/';

		function getDataByPatientId(id) {
			var dataStream = $websocket(WEBSOCKET_URI + id);
			var collection = [];
			dataStream.onMessage(function(message) {
				collection.push(JSON.parse(message.data));
			});

			var methods = {
				collection: collection,
				get: function() {
				  dataStream.send(JSON.stringify({ action: 'get' }));
				}
			};

			return methods;
		}

	}
})();
