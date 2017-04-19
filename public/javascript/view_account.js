angular.module('accountApp', [])
.controller('mainController', function ($scope, $http) {
  $scope.account = {
		 
  };
  
  $scope.title = ['นาย', 'นางสาว', 'นาง'];
  
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
	var data = JSON.stringify($scope.account);
	alert(data);
	$http.post('../updateaccount/' + accountId, data)
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