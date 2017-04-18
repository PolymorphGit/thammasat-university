angular.module('accountApp', [])
.controller('mainController', function ($scope, $http) {
  $scope.account = {
		 
  };
  
  //Get a account Detail
  $scope.getData = function (accountId) {	
	//alert(accountId);
    $http.get('../userinfo/' + accountId)
    .success((data) => {
      $scope.account = data;
      console.log(data);
    })
    .error((data) => {
      console.log('Error: ' + data);
    });
    
  };
  
  $scope.myfunction = function (data) {
      alert("---" + data);
  };
});