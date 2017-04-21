angular.module('leadApp', [])
.controller('mainController', function ($scope, $http) {
  $scope.id = '';
  $scope.lead = { };
  
  $scope.getData = function () {	
	//alert(accountId);
    $http.get('../studentinfo/' + $scope.id)
    .success((data) => {
    	console.log(data);
    	$scope.lead = data[0];
    })
    .error((data) => {
      console.log('Error: ' + data);
    });
  }
  
  $scope.saveData = function() {
	  if(lead.sfid == null)
		{
			$scope.createLead();
		}
		else
		{
			$scope.updateLead();
		}
  }
  
  $scope.createLead = function () {
	var data = JSON.stringify($scope.lead);
	$http.get('../createstudent', data)
	.success((data) => {
		
	})
	.error((data) => {
		console.log('Error: ' + data);
	});
  }
  
  $scope.updateLead = function () {
	var data = JSON.stringify($scope.lead);
	$http.get('../updatestudent/' + $scope.id, data)
	.success((data) => {
		
	})
	.error((data) => {
		console.log('Error: ' + data);
	});
  }
  
});