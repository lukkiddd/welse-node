(function () {
	'use strict';

	angular
		.module('app')
		.controller('friendDashboardCtrl', friendDashboardCtrl);

	friendDashboardCtrl.$inject = ['$stateParams', 'Data'];

	function friendDashboardCtrl($stateParams, Data) {
		var vm = this;
		
		vm.uid = $stateParams.uid;
		vm.chartConfig = {};
		getData();

		function getData() {
			Data.get($stateParams)
				.then(function(data) {
					
					vm.datas = data;

					_.forEach(vm.datas, function(data, key){
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

						var unit = vm.datas[key][0].unit || '';
						unit = unit.toUpperCase();

						vm.chartConfig[key] = {};
						vm.chartConfig[key] = {
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
								visible: false,
							},

							title: {
								text: ''
							},
							series: [{
								name: 'Value',
								type: vm.datas[key][0].chartType || 'line',
								marker: {
									enabled: false
								},
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
					})
				});
		}
	}
	
})();