angular.module('accountApp', [])
.controller('mainController', function ($scope, $http) {
  $scope.account = {
		 
  };
  
  //Get a account Detail
  $scope.getData = function (accountId) {	
	//alert(accountId);
    $http.get('../userinfo/' + accountId)
    .success((data) => {
    	console.log(data);
    	$scope.account = data[0];
    })
    .error((data) => {
      console.log('Error: ' + data);
    });
    
  };
  
  $scope.updateData = function (accountId) {
	$http.post('../updateaccount/' + accountId, $scope.account)
	.success((data) => {
		console.log(data);
		alert("Updated");
	})
	.error((data) => {
		console.log('Error: ' + data);
	});
  };
  
  $scope.myfunction = function (data) {
      alert("---" + data);
  };
});