(function() {
	'use strict';

	angular
			.module('app')
			.controller('dashboardUserCtrl', dashboardUserCtrl);

	dashboardUserCtrl.$inject = ['$window', '$state', '$interval', 'Data', 'Users', 'PatientControl', '$http'];

	function dashboardUserCtrl($window, $state, $interval, Data, Users, PatientControl, $http) {
		var vm = this;

		vm.cancelForm = cancelForm;
		vm.submitForm = submitForm;
		vm.datas = [];
		vm.chartConfig = {
		  options: {
		      chart: {
		          type: 'line',
		          animation: true,
		          zoomType: 'x'
		      },
		      tooltip: {
		          style: {
		              padding: 10,
		              fontWeight: 'bold'
		          },
		          valueSuffix: ''
		      },
		      title: '',
		      yAxis: {
		      	title: ''
		      },
		      xAxis: {
		      	title: '',
            type: 'category',
            categories: []
		      },
		      legend: {
            enabled: false
          },
		  },
		  plotOptions: {
          spline: {
              lineWidth: 4,
              states: {
                  hover: {
                      lineWidth: 5
                  }
              },
              marker: {
                  enabled: false
              },
          }
      },
		  series: [{
		      data: []
		  }],
		  loading: false,
		  useHighStocks: false,
		  size: {
		  	height: 200
		  }
		}

		isLogin();

		function isLogin() {
			Users.get()
				.then(function(user) {
					getData(user);
					showParents();
					vm.me = user;
				}).catch(function(error) {
					console.log(error);
				})
		}
		$interval(getData, 1000);

		function getData(user) {
			Data.get(user)
				.then(function(data) {
					console.log(data);
					vm.datas = data;
				});
		}

		vm.showParents = showParents;
		function showParents() {
			PatientControl.getParents(vm.authData)
				.then(function(parents) {
					vm.parents = parents;
				})
		}

		vm.approveParent = function(parent) {
			PatientControl.approveParent(parent)
				.then(function(parent) {
					vm.showParents();
				})
		}

		vm.declineParent = function(parent) {
			PatientControl.declineParent(parent)
				.then(function(parent) {
					vm.showParents();
				})
		}

		vm.setChart = function(value) {
			vm.dataChart = {};
			vm.dataChart = {name: value.topic};
			vm.chartConfig.series[0].data = [];
			_.forEach(_.takeRight(_.orderBy(value, 'datetime', 'asc'), 10),function(val) {
				vm.chartConfig.series[0].data.push([val.formNow,_.toNumber(val.body)]);
				vm.chartConfig.options.xAxis.categories.push(val.fromNow);
			});
		}

		function cancelForm() {
			$window.location.reload();
		}

		function submitForm(user) {
			console.log("=== SUBMIT FORM ===");
			console.log(user);
			Users.editProfile(user);
			vm.editForm = false;
		}

	}
})();
