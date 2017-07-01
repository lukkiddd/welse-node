(function () {
	'use strict';

	angular
		.module('app')
		.controller('dashboardDataCtrl', dashboardDataCtrl);

		dashboardDataCtrl.$inject = ['$scope', '$stateParams', 'Auth', 'Data'];

		function dashboardDataCtrl($scope, $stateParams, Auth, Data) {
			var vm = this;

			$scope.key = $stateParams.key;
			$scope.uid = $stateParams.uid;
			$scope.selectedData = [];

			Data
				.get($stateParams)
				.then(function (data) {
					$scope.selectedData = data[$scope.key]
					drawChart($scope.selectedData);
				});
			
			function drawChart(data) {
				var vals = _.map(data, function (val) {
					if(val.value == "Good") {
						return 1;
					} else if (val.value == "Bad") {
						return 0;
					} else if (val.value == null) {
						return 0;
					}
					
					return parseFloat(val.value);
				});
				

				var unit = data[0].unit || '';

				unit = unit.toUpperCase();

				$scope.chartData = {};
				$scope.chartData = {
					chart: {
						height: 200,
					},
					legend: {
						enabled: false,
					},
					xAxis: {
						visible: false,
					},
					yAxis: {
						plotBands: [{
            from: 30,
            to: vals[0] * 2,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'Normal',
                style: {
                    color: '#606060'
                }
							}
						}]
					},
					title: {
						text: ''
					},
					series: [{
						name: 'Value',
						type: data[0].chartType,
						data: vals,
						showInLegend: false,
						color: '#2a65ff',
						borderRadius: 3,
						pointPadding: 0.1,
						groupPadding: 0,
						borderWidth: 0,
						tooltip: {
							headerFormat: '',
							pointFormat: '{series.name}: <b>{point.y}</b><br/>',
							valueSuffix: ` ${unit}`,
						},
					}],
				}
			}
		}

})();