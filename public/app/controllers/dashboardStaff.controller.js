(function() {
	'use strict';

	angular
			.module('app')
			.controller('dashboardStaffCtrl', dashboardStaffCtrl);

	dashboardStaffCtrl.$inject = ['$state', '$stateParams', '$interval', 'Data', 'Users', 'PatientControl'];

	function dashboardStaffCtrl($state, $stateParams, $interval, Data, Users, PatientControl) {
		var vm = this;

		vm.exportPDF = exportPDF;
		vm.users = [];
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
            type: 'datetime',
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
					getControlList()
					vm.me = user;
				}).catch(function(error) {
					console.log(error);
				})
		}

		function getUsersAll(patients) {
			Users.getAll()
				.then(function(users) {
					_.forEach(users, function(user) {
						var found = 0;
						_.forEach(patients, function(patient) {
							if(user.id == patient.id) {
								found = 1;
							}
						});
						if(!found) {
							vm.users.push(user);
						}
					});
				})
		}

		function getControlList() {
			PatientControl.getPatients()
				.then(function(patients) {
					console.log(patients);
					vm.patients = patients;
					getUsersAll(vm.patients);
					if($stateParams.index) {
						viewUserData(vm.patients[$stateParams.index]);
					}
				})
		}

		vm.addPatientToList = function(user) {
			console.log(user);
			PatientControl.add(user)
				.then(function(data) {
					vm.showAddPatientModal = false;
					vm.patientControl = "";
					$state.reload();
				})
		}

		vm.userData = function(index, patient) {
			if(patient.status != 'pending')
				$state.go('dashboard-staff-user',{index: index})
		}

		vm.declinePatient = function(patient) {
			console.log(patient);
			PatientControl.declinePatient(patient)
				.then(function(patient) {
					console.log(patient);
					$state.reload();
				})
		}

		function viewUserData(patient) {
			if(patient.status != 'pending') {
				getData(patient);
			}
		}
		
		function getData(patient) {
			console.log(patient);
			Data.get(patient)
				.then(function(data) {
					var index = 0;
					vm.currentPatient = patient;
					vm.datas = data;
					vm.showPatientList = false;
					vm.showPatient = true;
				});
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

		function exportPDF(selector) {
			html2canvas(document.getElementById(selector), {
	        onrendered: function (canvas) {
	            var data = canvas.toDataURL();
	            var docDefinition = {
	                content: [{
	                    image: data,
	                    width: 500,
	                }]
	            };
	            pdfMake.createPdf(docDefinition).download("Report.pdf");
	        }
	    });
		}

	}
})();
